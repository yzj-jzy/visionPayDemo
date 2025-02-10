import React, { useEffect } from 'react';

const ErrorPopup = ({ message, setShowErrorPopup }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowErrorPopup(false);
    }, 4000); // Hide after 4 seconds

    return () => clearTimeout(timer); // Clear timeout if the component is unmounted
  }, [setShowErrorPopup]);

  return (
    <div className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 w-[90%] max-w-4xl flex items-center justify-between">
      <div className="flex items-center">
        <span className="bg-red-400 rounded-full w-3 h-3 mr-2"></span>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorPopup;
