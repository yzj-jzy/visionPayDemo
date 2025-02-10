import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const MerchantSelectionPopup = ({ selectedMerchants, onSelect, onClose, availableMerchants }) => {
  const [tempSelectedMerchants, setTempSelectedMerchants] = useState([...selectedMerchants]);

  const handleMerchantChange = (merchant) => {
    if (tempSelectedMerchants.some((sm) => sm.id === merchant.id)) {
      setTempSelectedMerchants(tempSelectedMerchants.filter((sm) => sm.id !== merchant.id));
    } else {
      setTempSelectedMerchants([...tempSelectedMerchants, merchant]);
    }
  };

  const handleDone = () => {
    onSelect(tempSelectedMerchants);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50" style={{ top: '10%' }}>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Popup */}
      <div className="relative bg-white text-black p-6 rounded-lg shadow-lg w-[90%] max-w-md z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Merchants</h2>
          <button className="text-gray-600 hover:text-black" onClick={onClose}>
            <FaTimes/>
          </button>
        </div>
        <div className="space-y-4">
          {availableMerchants.map((merchant) => (
            <div key={merchant.id} className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={tempSelectedMerchants.some((sm) => sm.id === merchant.id)}
                onChange={() => handleMerchantChange(merchant)}
              />
              <label className="ml-2 text-sm text-gray-700">{merchant.name}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 px-4 rounded-lg"
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchantSelectionPopup;
