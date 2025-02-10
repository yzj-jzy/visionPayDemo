import React, { useState } from 'react';
import ContentStyle from '../ContentStyle';
import { createPaymentLink } from '../../../api/Transaction';
import { useAuth } from '../../../contexts/ContentContext';

const PaymentLink = () => {
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [copied, setCopied] = useState(false);
  const { selectedMerchant } = useAuth();
  const selectedMerchantId = selectedMerchant.id;

  const handleCreateLink = async () => {
    const generatedReference = reference || new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const formattedAmount = parseFloat(amount).toFixed(2);

    try {
      const res = await createPaymentLink(generatedReference, selectedMerchantId, formattedAmount);
      setPaymentLink(res.message);
    } catch (error) {
      console.error('Error creating payment link:', error);
    }
  };

  const handleCopyToClipboard = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        })
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  const handleReferenceChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); 
    setReference(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const validAmount = value.match(/^\d*(\.\d{0,2})?$/); 
    if (validAmount) {
      setAmount(value);
    }
  };

  return (
    <ContentStyle>
      <div className="h-128  flex flex-col bg-gradient-to-b from-blue-50 to-white rounded-3xl pb-10 shadow-lg p-4 sm:p-8 md:p-12 lg:p-16">
        <div className="max-w-2xl mx-auto px-4 md:px-8 lg:px-12 py-8 rounded-3xl flex-1 flex flex-col justify-center bg-white shadow-md mt-10 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 border-b-2 border-gray-300 pb-4 pt-2 text-center text-blue-700">
            Create Payment Link
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8">
            Create a unique link to accept a payment online in just a couple of clicks. Add a reference, transaction amount, and then share the link with your customers.
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center" htmlFor="reference">
              <span className="mr-2">Reference</span>
              <p className="text-gray-500 text-xs">(Optional)</p>
            </label>
            <p className="text-xs text-gray-500 mb-2">Reference will be auto-generated if the field is left blank.</p>
            <input
              id="reference"
              type="text"
              value={reference}
              onChange={handleReferenceChange}
              maxLength="255"
              className="block w-full border border-gray-300 p-3 rounded-lg transition focus:outline-none focus:ring-0"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex" htmlFor="amount">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="mr-2 text-lg text-gray-700 font-semibold">$</span>
              <input
                type="text"
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-0 transition"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter Amount"
                min="0"
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
          
          <button
            onClick={handleCreateLink}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed mb-8 font-semibold text-sm sm:text-base"
            disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
          >
            Create Link
          </button>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Payment Link URL</h3>
            <input
              type="text"
              value={paymentLink}
              readOnly
              className="block w-full border border-gray-300 p-3 rounded-lg mb-4 bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none focus:ring-0"
            />
            <button
              onClick={handleCopyToClipboard}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-sm sm:text-base"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </div>
      </div>
    </ContentStyle>
  );
};

export default PaymentLink;
