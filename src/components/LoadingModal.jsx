import React from 'react';

const LoadingModal = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">—</span>
        </div>
        <div className="text-lg font-medium">{message || 'Loading...'}</div>
      </div>
    </div>
  );
};

export default LoadingModal;
