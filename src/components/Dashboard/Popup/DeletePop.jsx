import React from 'react';

const DeletePop = ({ handleDelete, handleCancel, message, title = "Delete confirmation" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-[90%] max-w-md flex flex-col items-center justify-center">
        <div className="absolute top-4 right-4 cursor-pointer" onClick={handleCancel}>
          <span className="text-gray-500 text-xl font-bold">&times;</span>
        </div>
        
        <h2 className="text-red-500 text-lg font-semibold mb-4">{title}</h2>
      
        <p className="text-center text-gray-800 mb-8">{message}?</p>
        
        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-lg"
            onClick={handleDelete} 
          >
            Yes
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-300 text-white py-2 px-6 rounded-lg"
            onClick={handleCancel} 
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePop;
