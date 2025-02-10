import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTransactionById, RefundTransaction } from '../../../api/Transaction';
import ContentStyle from '../ContentStyle';
import { useAuth } from '../../../contexts/ContentContext';
import { FaCcMastercard, FaCcVisa, FaReply, FaCheck, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';

const TransactionView = () => {
  const initialTransactionData = {
    transactionHistories: [
      {
        id: 'N/A',
        typeDescription: 'string',
        totalAmount: 0,
        successful: true,
        status: 'string',
        message: 'string',
        transactionDate: 'N/A',
        responseCode: 'string',
      },
    ],
    approvalCode: 'string',
    reference: 'string',
    cardSignature: 'string',
    cardHolder: 'string',
    cardExpiry: 'string',
    cardType: 'string',
    authorizedAmount: 0,
    capturedAmount: 0,
    captureDate: 'N/A',
    taxAmount: 0,
    processingFeeAmount: 0,
    gatewayFeeAmount: 0,
    payerAuthenticationFeeAmount: 0,
    decisionManagerFeeAmount: 0,
    interchangeFeeAmount: 0,
    schemeFeeAmount: 0,
    refundedAmount: 0,
    currency: 'string',
    transactionDate: 'N/A',
    captured: true,
    is3ds2: true,
    description3ds2: 'string',
    successful: true,
    responseCode: 'string',
  };

  const [transactionData, setTransactionData] = useState(initialTransactionData);
  const [isRefunding, setIsRefunding] = useState(false);
  const [showRefundPop, setShowRefundPop] = useState(false);
  const [showErrorPop, setShowErrorPop] = useState(false);
  const [showSuccessPop, setShowSuccessPop] = useState(false);
  const [refundErrorMessage, setRefundErrorMessage] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const location = useLocation();
  const ref = new URLSearchParams(location.search).get('ref');
  const { canTransactionRefund } = useAuth();
  const selectedMerchant = JSON.parse(sessionStorage.getItem("selectedMerchant"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        if (ref) {
          const transaction = await getTransactionById(ref, selectedMerchant.id);
          setTransactionData(transaction);
        }
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };
    fetchTransactionData();
  }, [ref]);

  const getCardIcon = (cardType) => {
    switch (cardType) {
      case 'Visa':
        return <FaCcVisa className="text-blue-600 text-2xl" />;
      case 'MasterCard':
        return <FaCcMastercard className="text-orange-600 text-2xl" />;
      default:
        return null;
    }
  };

  const getFieldValue = (field, type = 'string') => {
    if (transactionData[field] !== undefined && transactionData[field] !== null) {
      return transactionData[field];
    }
    return type === 'int' ? 0 : 'N/A';
  };

  const toDateFormat = (date) => {
    if (date && date !== 'N/A' && typeof date === 'string') {
      try {
        return format(new Date(date), 'dd/MM/yyyy HH:mm');
      } catch (error) {
        console.error("Invalid date format:", error);
      }
    }
  };

const toDecimal = (number, decimal = 2) => {
  if (number !== undefined && number !== null) {
    return Number(number).toLocaleString('en-US', {
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    });
  }
  return '0.00';
};


  const handleRefundClick = () => {
    setShowRefundPop(true);
  };

  const handleRefundConfirm = async () => {
    setIsRefunding(true);
    try {
      await RefundTransaction(ref, selectedMerchant.id, refundAmount);
      const updatedTransaction = await getTransactionById(ref, selectedMerchant.id);
      setTransactionData(updatedTransaction);
      setShowSuccessPop(true);
    } catch (error) {
      console.error('Error processing refund:', error);
      setRefundErrorMessage(error.message || 'There was an error processing the refund.');
      setShowErrorPop(true);
    } finally {
      setIsRefunding(false);
      setShowRefundPop(false);
    }
  };

  const handleRefundCancel = () => {
    setShowRefundPop(false);
  };

  const handleErrorPopClose = () => {
    setShowErrorPop(false);
  };

  const handleSuccessPopClose = () => {
    setShowSuccessPop(false);
  };

  const paymentFields = [
    { label: 'Reference', value: getFieldValue('reference'), isCurrency: false },
    { label: 'Authorization ID', value: getFieldValue('approvalCode'), isCurrency: false },
    { label: 'Transaction Date', value: toDateFormat(getFieldValue('transactionDate')), isCurrency: false },
    { label: 'Authorized Amount', value: `$${toDecimal(getFieldValue('authorizedAmount', 'int'))} ${getFieldValue('currency')}`, isCurrency: true },
    { label: 'Settlement Date', value: toDateFormat(getFieldValue('captureDate')), isCurrency: false },
    { label: 'Settlement Amount', value: `$${toDecimal(getFieldValue('capturedAmount', 'int'))} ${getFieldValue('currency')}`, isCurrency: true },
    { label: '3DS2', value: getFieldValue('description3ds2'), isSpecial: true, condition: transactionData.is3ds2, successClass: 'text-green-600 bg-green-100', failClass: 'text-red-600 bg-red-100' },
    { label: 'Refunded Amount', value: `$${toDecimal(getFieldValue('refundedAmount', 'int'))} ${getFieldValue('currency')}`, isCurrency: true },
    { label: 'Response Code', value: getFieldValue('responseCode'), isSpecial: true, condition: transactionData.successful, successClass: 'text-green-600 bg-green-100', failClass: 'text-red-600 bg-red-100' },
    { label: 'Tax', value: `$${toDecimal(getFieldValue('taxAmount', 'int'))} ${getFieldValue('currency')}`, isCurrency: true },
  ];

  const feeDetails = [
    { label: 'Processing Fee', field: 'processingFeeAmount' },
    { label: 'Gateway Fee', field: 'gatewayFeeAmount' },
    { label: '3DS2 Fee', field: 'payerAuthenticationFeeAmount' },
    { label: 'Decision Manager Fee', field: 'decisionManagerFeeAmount' },
    { label: 'Interchange Fee', field: 'interchangeFeeAmount' },
    { label: 'Scheme Fee', field: 'schemeFeeAmount' },
  ];
  
  const customerDetails = [
    { label: 'Card Holder', field: 'cardHolder' },
    { label: 'Payment Method', field: 'cardSignature', isPaymentMethod: true },
    { label: 'Card Expiry', field: 'cardExpiry' },
  ];
  

  return (
    <ContentStyle>
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl p-8 shadow-lg phone:overflow-x-auto tabletSmall:overflow-x-auto">
      <div className="flex items-center mb-8 space-x-4">
      <button
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200 ease-in-out flex items-center space-x-2"
          onClick={() => navigate(-1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Transaction Details</h1>
      </div>

        {/* Payment Details */}
        <div className="bg-gray-50 shadow-lg border border-gray-200 p-6 rounded-lg mb-6 shadow-lg bg-white border p-6 rounded-3xl pb-10 shadow-lg border border-gray-200">
          <div className='border-b pb-4 flex items-center justify-between mb-4'>
            <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>
            {canTransactionRefund && (
              <div className="flex space-x-4">
                <button
                  disabled={isRefunding}
                  className={`px-4 py-2 text-white flex ${isRefunding ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded hover:bg-blue-600 transition duration-300`}
                  onClick={handleRefundClick}
                >
                  <p className='mr-2'>{isRefunding ? 'Refunding...' : 'Refund'}</p>
                  <FaReply/>
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 tabletSmall:grid-cols-1 gap-y-4 gap-x-8 text-sm text-gray-600">
            {paymentFields.map((field, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <span className="font-medium text-gray-900 phone:font-bold">
                  {field.label}
                </span>
                {field.isSpecial ? (
                  <span
                    className={`${
                      field.condition ? field.successClass : field.failClass
                    } py-1 px-3 rounded-full md:col-span-2 whitespace-nowrap inline-block text-center w-48 phone:w-44 phone:w-auto`}
                  >
                    {field.value}
                  </span>
                ) : (
                  <span className={`md:col-span-2 ${field.isCurrency ? 'whitespace-nowrap' : 'whitespace-normal'} overflow-hidden text-ellipsis w-32`}>
                    {field.value}
                  </span>
                )}
              </div>
            ))}
            </div>
        </div>

        {/*Fee Details */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-4">Fee Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 tabletSmall:grid-cols-1 gap-y-4 gap-x-8 text-sm text-gray-600">
            {feeDetails.map((fee, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <span className="font-medium text-gray-900 phone:font-bold">{fee.label}</span>
                <span className="md:col-span-2 whitespace-normal overflow-hidden text-ellipsis">
                  ${toDecimal(getFieldValue(fee.field, 'int'), 6)} {getFieldValue('currency')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* // Customer Details */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 tabletSmall:grid-cols-1 gap-y-4 gap-x-8 text-sm text-gray-600">
            {customerDetails.map((detail, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <span className="font-medium text-gray-900 phone:font-bold">{detail.label}</span>
                {detail.isPaymentMethod ? (
                  <div className="col-span-2 flex items-center space-x-2">
                    {getCardIcon(transactionData.cardType)}
                    <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {getFieldValue(detail.field)}
                    </span>
                  </div>
                ) : (
                  <span className="md:col-span-2 whitespace-normal overflow-hidden text-ellipsis">
                    {getFieldValue(detail.field)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* // Transaction History */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg phone:overflow-x-auto overflow-x-auto tabletSmall:overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-4">Transaction History</h2>
          <table className="min-w-full divide-y divide-gray-300 text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-100">
                {['ID', 'Type', 'Amount', 'Successful', 'Processor Status', 'Date', 'Response Code', 'Processor Message'].map((header, index) => (
                  <th key={index} className="px-6 py-3 text-left font-medium text-gray-700">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactionData.transactionHistories.map((history, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{history.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{history.typeDescription}</td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                    ${toDecimal(history.totalAmount)} {transactionData.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {history.successful ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{history.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{toDateFormat(history.transactionDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{history.responseCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{history.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showRefundPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-[90%] max-w-md flex flex-col items-center justify-center">
            <div className="absolute top-4 right-4 cursor-pointer" onClick={handleRefundCancel}>
              <span className="text-gray-500 text-xl font-bold">&times;</span>
            </div>
            <h2 className="text-red-500 text-lg font-semibold mb-4">Refund Confirmation</h2>
            <p className="text-center text-gray-800 mb-4">Please enter the refund amount:</p>
            <input
              type="number"
              className="border border-gray-300 p-2 rounded mb-4 w-full"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="Refund Amount"
              min="0"
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e') {
                  e.preventDefault();
                }
              }}
            />

            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-lg"
                onClick={handleRefundConfirm}
              >
                Yes
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-300 text-white py-2 px-6 rounded-lg"
                onClick={handleRefundCancel}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-[90%] max-w-md flex flex-col items-center justify-center">
            <div className="absolute top-4 right-4 cursor-pointer" onClick={handleErrorPopClose}>
              <span className="text-gray-500 text-xl font-bold">&times;</span>
            </div>
            <h2 className="text-red-500 text-lg font-semibold mb-4">Refund Failed</h2>
            <p className="text-center text-gray-800 mb-4">{refundErrorMessage}</p>
            <button
              className="bg-gray-400 hover:bg-gray-300 text-white py-2 px-6 rounded-lg"
              onClick={handleErrorPopClose}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSuccessPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-[90%] max-w-md flex flex-col items-center justify-center">
            <div className="absolute top-4 right-4 cursor-pointer" onClick={handleSuccessPopClose}>
              <span className="text-gray-500 text-xl font-bold">&times;</span>
            </div>
            <h2 className="text-green-500 text-lg font-semibold mb-4">Refund Successful</h2>
            <p className="text-center text-gray-800 mb-4">The refund was processed successfully.</p>
            <button
              className="bg-green-500 hover:bg-green-400 text-white py-2 px-6 rounded-lg"
              onClick={handleSuccessPopClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </ContentStyle>
  );
};

export default TransactionView;
