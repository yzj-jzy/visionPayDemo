import React, { useState } from 'react';
import ContentStyle from '../ContentStyle';
import { authorizePayment } from '../../../api/Transaction';
import { useAuth } from '../../../contexts/ContentContext';

const TransactionCreate = () => {
  const [currency, setCurrency] = useState('AUD');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiryMM, setCardExpiryMM] = useState('');
  const [cardExpiryYYYY, setCardExpiryYYYY] = useState('');
  const [cvv, setCvv] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const selectedMerchant = JSON.parse(sessionStorage.getItem('selectedMerchant'));

  const getIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
      return null;
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || !/^[0-9]+(\.[0-9]{1,2})?$/.test(amount)) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (nameOnCard.length === 0 || nameOnCard.length > 40) {
      newErrors.nameOnCard = 'Name on card is required and should be less than 40 characters';
    }
    if (!/^[0-9]{16,19}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Card number must be between 16 and 19 digits';
    }
    if (!/^[0-9]{2}$/.test(cardExpiryMM)) {
      newErrors.cardExpiryMM = 'Enter a valid 2-digit month';
    }
    if (!/^[0-9]{4}$/.test(cardExpiryYYYY)) {
      newErrors.cardExpiryYYYY = 'Enter a valid 4-digit year';
    }
    if (!/^[0-9]{3,4}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFields = () => {
    setCurrency('AUD');
    setAmount('');
    setReference('');
    setNameOnCard('');
    setCardNumber('');
    setCardExpiryMM('');
    setCardExpiryYYYY('');
    setCvv('');
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setLoading(true);
    const userIp = await getIp();

    if (!userIp) {
      setErrorMessage('Could not fetch user IP.');
      setLoading(false);
      return;
    }

    const generatedReference = reference || new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const formattedAmount = parseFloat(amount).toFixed(2); 
    const cardExpiry = `${cardExpiryMM}/${cardExpiryYYYY}`;

    try {
      const res = await authorizePayment(
        selectedMerchant.id,
        generatedReference,
        nameOnCard,
        cardNumber,
        cardExpiry,
        formattedAmount,
        userIp,
        currency,
        true,
        cvv
      );

      if (res.success) {
        setSuccess(true);
        setErrorMessage('');
      } else {
        setErrorMessage(res.message || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrorMessage('An error occurred while processing the payment. Please try again.');
    }
    clearFields();
    setLoading(false);
  };

  return (
    <ContentStyle>
      <div className="relative h-128 flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white rounded-3xl pb-10 shadow-lg p-4 sm:p-8 md:p-12 lg:p-16">
        <div className="max-w-2xl mx-auto bg-white shadow-md p-6 sm:p-8 lg:p-12 mt-6 bg-white border p-6 rounded-3xl pb-10 shadow-lg ">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 border-b-2 border-gray-300 pb-4 pt-2 text-center text-blue-700">
          Virtual Terminal
        </h2>
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex justify-center items-center z-10">
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-800">Processing payment, please wait...</p>
              </div>
            </div>
          )}

          {!success ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">New Purchase</h2>

              {errorMessage && (
                <div className="bg-red-100 border-l-4 border-red-400 text-red-700 p-3 mb-4">
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="block w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-0"
                  >
                    <option value="AUD">AUD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="$"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                        setAmount(value);
                      }
                    }}
                    className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Unique reference</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  maxLength="255"
                  className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is your reference (e.g. Credit Note reference, or similar). Note a reference will be automatically generated if one is not provided. This will not show up on the customer's statement.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  maxLength="40"
                  className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.nameOnCard && <p className="text-red-500 text-sm mt-1">{errors.nameOnCard}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="4444 3333 2222 1111"
                  maxLength="19"
                  className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Month (MM) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardExpiryMM}
                    onChange={(e) => setCardExpiryMM(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    placeholder="MM"
                    className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.cardExpiryMM && <p className="text-red-500 text-sm mt-1">{errors.cardExpiryMM}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Year (YYYY) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardExpiryYYYY}
                    onChange={(e) => setCardExpiryYYYY(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="YYYY"
                    className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.cardExpiryYYYY && <p className="text-red-500 text-sm mt-1">{errors.cardExpiryYYYY}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="CVV"
                  maxLength="4"
                  className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
              </div>

              <div className="p-6 rounded-lg bg-blue-100">
                <p className="text-sm text-gray-600 mb-6">
                  <strong className="text-gray-800">Payment Notice:</strong> By clicking the <span className="text-blue-700 font-semibold">'Charge Card'</span> button below, you will immediately charge the customer's credit card for the specified amount. By proceeding, you confirm that you are authorized to charge this customer's card for the amount shown.
                </p>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-colors duration-300 ease-in-out text-sm sm:text-base ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="inline-block w-5 h-5 mr-2 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Charge Card'
                  )}
                </button>
              </div>

            </>
          ) : (
            <div className="h-full flex items-center justify-center flex-col">
              <h2 className="text-2xl font-semibold mb-6">Payment Successful</h2>
              <p className="text-lg mb-8">Your payment was successfully processed.</p>
              <button
                onClick={() => setSuccess(false)}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
              >
                Make Another Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </ContentStyle>
  );
};

export default TransactionCreate;
