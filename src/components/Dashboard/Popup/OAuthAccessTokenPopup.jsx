import React, { useState, useEffect } from 'react';
import { FaClipboard, FaSyncAlt, FaTimes } from 'react-icons/fa';
import { getAPIKeyById, renewAccessToken } from '../../../api/APIKey';
import { RssIcon } from '@heroicons/react/20/solid';

const OAuthAccessTokenPopup = ({ apiKey, onClose, onRenew }) => {
  const [copied, setCopied] = useState(false);
  const [fullAccessToken, setFullAccessToken] = useState('');
  const [tokenDateTime, setTokenDateTime] = useState(null); 

  const handleCopy = () => {
    if (fullAccessToken) {
      navigator.clipboard.writeText(fullAccessToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleRenew = async () => {
    try {
      const newAccessToken = await renewAccessToken(apiKey.id);
      setFullAccessToken(newAccessToken.message);
      setTokenDateTime(new Date());
    } catch (error) {
      console.error('renew token update failed');
    }
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await getAPIKeyById(apiKey.id);
        setFullAccessToken(response.accessToken || '');
        setTokenDateTime(response.tokenDateTime || null);
      } catch (error) {
        console.error('Failed to fetch API key:', error);
      }
    };

    fetchApiKey();
  }, [apiKey]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Popup */}
      <div className="relative bg-white text-black p-6 rounded-lg shadow-lg w-[90%] max-w-2xl z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">OAuth Access Token</h2>
          <button className="text-gray-600 hover:text-black" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <p className="mb-4">
          This access token serves as the authentication key for accessing the OPT APIs. For detailed instructions on acquiring the authentication token, please refer to the <a href="https://apigateway.visionpay.com.au/swagger/index.html" target="_blank" className="text-blue-600 underline">documentation</a>.
        </p>
        <div className="space-y-4">
          <div className="token-info flex items-center justify-between border-b pb-2">
            <label className="font-semibold">OAuth Access Token:</label>
            <span>{fullAccessToken ? '********************' + fullAccessToken.slice(-5) : 'N/A'}</span>
          </div>
          <div className="token-info flex items-center justify-between border-b pb-2">
            <label className="font-semibold">Date Created:</label>
            <span>
              {tokenDateTime
                ? new Date(tokenDateTime).toLocaleString('en-AU', {
                    timeZone: 'Australia/Sydney',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }).replace(',', '')
                : 'N/A'}
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 px-6 rounded-lg flex items-center space-x-2"
            onClick={handleCopy}
          >
            <FaClipboard /> <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 px-6 rounded-lg flex items-center space-x-2"
            onClick={handleRenew}
          >
            <FaSyncAlt /> <span>Renew</span>
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black text-sm py-2 px-6 rounded-lg flex items-center space-x-2"
            onClick={onClose}
          >
            <FaTimes /> <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthAccessTokenPopup;
