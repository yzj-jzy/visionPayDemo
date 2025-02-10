import React from 'react';

const TransactionCard = ({ icon, title, value, isInteger = false, dollarSign = false }) => {
  const displayValue = value == null || isNaN(value)
    ? isInteger
      ? 0
      : "0.00"
    : isInteger
      ? parseInt(value, 10)
      : parseFloat(value).toFixed(2);

  let [integerPart, decimalPart] = displayValue.toString().split(".");

  // Add thousands separator if dollarSign is true
  if (dollarSign) {
    integerPart = parseInt(integerPart, 10).toLocaleString('en-US');
  }

  return (
    <div className="border border-gray-200 bg-white rounded-lg shadow-md p-6 flex flex-col justify-between items-center w-full tablet:w-[28rem] tablet:h-40">
      <div className="flex ml-1 items-center w-full">
        <div className="flex-shrink-0 text-blue-500 text-2xl mr-2">
          {icon}
        </div>
        <h2 className="ml text-gray-500 text-base font-medium flex">
          {title}
        </h2>
      </div>
      <div className="mt-4 ml-1 w-full">
        <p className="text-4xl font-semibold text-black">
          {dollarSign && <span className="text-2xl align-top text-3xl mr-3">$</span>}
          {integerPart}
          {!isInteger && <span className="text-2xl align-top">.{decimalPart}</span>} 
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;
