import React from "react";

const ApplePayModal = ({
  isOpen,
  onClose,
  onActivate,
  applePayDetails,
  setApplePayDetails,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-3xl shadow-lg relative">
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
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Activate Apple Pay</h2>

        {/* Instructions */}
        <div className="text-gray-600 space-y-4 mb-6">
          <p>To activate, please follow the steps below:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Go to{' '}
              <a
                href="https://developer.apple.com/account/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Apple Developer Account
              </a>
              , and log in or create a new account.
            </li>
            <li>Create a Merchant Identifier in your developer account.</li>
            <li>Generate a Payment Processing Certificate associated with your Merchant Identifier.</li>
            <li>Create a Merchant Identity Certificate.</li>
            <li>Register your merchant domains.</li>
            <li>
              Copy the Merchant ID, download the Payment Processing Certificate, and the Merchant Identity Certificate, and upload them in the fields below. For more details, please visit{' '}
              <a
                href="https://developer.apple.com/documentation/passkit/setting_up_apple_pay_requirements"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Configure Apple Pay on the web
              </a>
              .
            </li>
          </ol>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Apple Pay Merchant ID */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Apple Pay Merchant ID</label>
            <input
              type="text"
              value={applePayDetails.merchantId}
              onChange={(e) => {
                const newDetails = { ...applePayDetails, merchantId: e.target.value };
                console.log("Updating merchantId to:", newDetails.merchantId);
                setApplePayDetails(newDetails);
              }}
              placeholder="Apple Pay Merchant ID"
              className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Payment Processing Certificate */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Payment Processing Certificate (.pfx)
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept=".pfx"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    const newCert = e.target.files[0];
                    console.log("Updating processingCert to:", newCert);
                    setApplePayDetails({ ...applePayDetails, processingCert: newCert });
                    console.log(applePayDetails);
                  }
                }}
                className="hidden"
                id="processingCert"
              />
              <label
                htmlFor="processingCert"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition"
              >
                Upload Certificate
              </label>
              {applePayDetails.processingCert && (
                <span className="ml-4 text-gray-600">{applePayDetails.processingCert.name}</span>
              )}
            </div>
          </div>

          {/* Payment Processing Certificate Password */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Payment Processing Certificate Password
            </label>
            <input
              type="password"
              value={applePayDetails.processingCertPassword}
              onChange={(e) => {
                const newDetails = { ...applePayDetails, processingCertPassword: e.target.value };
                console.log("Updating processingCertPassword to:", newDetails.processingCertPassword);
                setApplePayDetails(newDetails);
                
              }}
              placeholder="Enter password"
              className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Merchant Identity Certificate */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Merchant Identity Certificate (.pfx)
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept=".pfx"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    const newIdentityCert = e.target.files[0];
                    console.log("Updating identityCert to:", newIdentityCert);
                    setApplePayDetails((prev) => ({
                      ...prev,
                      identityCert: newIdentityCert,
                    }));
                  }
                }}
                className="hidden"
                id="identityCert" // 确保此处的 id 和 label 中的 htmlFor 一致
              />
              <label
                htmlFor="identityCert" // 确保与 input 元素的 id 一致
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition"
              >
                Upload Certificate
              </label>
              {applePayDetails.identityCert && (
                <span className="ml-4 text-gray-600">{applePayDetails.identityCert.name}</span>
              )}
            </div>
          </div>


          {/* Merchant Identity Certificate Password */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Merchant Identity Certificate Password
            </label>
            <input
              type="password"
              value={applePayDetails.identityCertPassword}
              onChange={(e) => {
                const newDetails = { ...applePayDetails, identityCertPassword: e.target.value };
                console.log("Updating identityCertPassword to:", newDetails.identityCertPassword);
                setApplePayDetails(newDetails);
              }}
              placeholder="Enter password"
              className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            onClick={onActivate}
          >
            Activate
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 transition ml-4"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplePayModal;
