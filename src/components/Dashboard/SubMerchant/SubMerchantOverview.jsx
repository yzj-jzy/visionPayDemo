import React, { useState, useEffect } from 'react';
import ContentStyle from '../ContentStyle';
import { getSubMerchantOverviewById } from '../../../api/SubMerchant';
import { useAuth } from '../../../contexts/ContentContext';

const SubMerchantOverview = function () {
  const { selectedMerchant } = useAuth();
  const [merchantDetails, setMerchantDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    if (selectedMerchant && selectedMerchant.id) {
      loadMerchantDetails(selectedMerchant.id);
    }
  }, [selectedMerchant]);

  const loadMerchantDetails = async (merchantId) => {
    try {
      setLoading(true);
      const response = await getSubMerchantOverviewById(merchantId);
      if (response && typeof response === 'object') {
        setMerchantDetails(response);
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Failed to load merchant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (value, label) => {
    if (value) {
      navigator.clipboard.writeText(value).then(() => {
        setCopiedField(label);
        setTimeout(() => setCopiedField(''), 2000); // Clear "Copied!" after 2 seconds
      }).catch((error) => {
        console.error('Failed to copy:', error);
      });
    }
  };

  return (
    <ContentStyle>
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl pb-44 p-6 shadow-lg overflow-x-auto box-content">
        <h1 className="text-2xl font-bold text-gray-700 mb-8">Overview</h1>
        
        <div className="bg-white desktop:w-3/5 border border-gray-200 p-8 rounded-2xl shadow-lg mx-auto mt-16">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-6">Company Details</h2>
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
            {renderDetailRow("ID", merchantDetails.id)}
            {renderDetailRow("Trading Name", merchantDetails.name)}
            {renderDetailRow("ABN", merchantDetails.abn)}
            {renderDetailRow("Address", merchantDetails.address)}
            {renderDetailRow("Phone", merchantDetails.phone)}
            {renderDetailRow("Email", merchantDetails.email)}
            {renderDetailRow("Country Code", merchantDetails.countryCode)}
          </div>
        </div>
      </div>
    </ContentStyle>
  );

  function renderDetailRow(label, value) {
    return (
      <div className="flex justify-between items-center gap-x-4">
        <span className="font-medium text-gray-900">
          {label} {copiedField === label && <span className="text-gray-500">(copied)</span>}
        </span>
        <div
          className="flex ml-16 items-center space-x-1 text-gray-900 relative group cursor-pointer"
          onClick={() => handleCopy(value, label)}
        >
          <span>{value || 'N/A'}</span>
          {/* Tooltip */}
          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
            Click to copy
          </span>
        </div>
      </div>
    );
  }
};

export default SubMerchantOverview;
