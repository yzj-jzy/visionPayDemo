import React from "react";

const GooglePayModal = ({
  isOpen,
  onClose,
  onActivate,
  googlePayMerchantId,
  setGooglePayMerchantId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-lg shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Activate Google Pay</h2>

        {/* Instructions */}
        <div className="text-gray-600 space-y-4 mb-6">
          <p>
            To activate, please follow the steps below:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Go to{' '}
              <a
                href="https://pay.google.com/business/console"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Google Pay Business Console
              </a>
              , log in with your credentials or create a new account. Fill in the Business Name and Location fields, then click Continue.
            </li>
            <li>
              Access the Business Profile section from the side menu. Complete the required business information and submit your application for Google’s approval.
            </li>
            <li>
              Once approved, copy your Merchant ID from the console and paste it into the field below.
            </li>
            <li>
              Finalize the integration by completing all steps in the sandbox or staging environment. For more details, visit{' '}
              <a
                href="https://developers.google.com/pay/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Google Pay API Documentation
              </a>
              .
            </li>
          </ol>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={googlePayMerchantId}
          onChange={(e) => setGooglePayMerchantId(e.target.value)}
          placeholder="Enter Google Pay Merchant ID"
          className="border-2 border-gray-300 p-3 w-full rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            onClick={onActivate}
          >
            Activate
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GooglePayModal;
