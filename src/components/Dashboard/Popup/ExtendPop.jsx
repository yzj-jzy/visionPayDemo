import React from 'react';

const ExtendPop = ({ handleExtendSession, setIsTokenExpiring }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-[90%] max-w-4xl flex items-center justify-between">
      <div className="flex items-center">
        <span className="bg-green-400 rounded-full w-3 h-3 mr-2"></span>
        <p className="text-sm">
          <strong>Session Timeout Warning:</strong> You will be logged out in 5 minutes due to inactivity.
        </p>
      </div>
      <button
        className="ml-4 bg-gray-600 hover:bg-gray-500 text-white text-sm py-2 px-4 rounded-lg"
        onClick={handleExtendSession}
      >
        Extend Session
      </button>
      <button
        className="ml-2 text-gray-400 hover:text-white"
        onClick={() => setIsTokenExpiring(false)}
      >
        X
      </button>
    </div>
  );
};

export default ExtendPop;
