import React, { useState, useEffect } from 'react';
import { FaKey, FaTrash, FaCheckCircle } from 'react-icons/fa';
import ContentStyle from '../ContentStyle';
import { getAPIKey, deleteAPIKey, activeAPIKey, getAPIKeyById } from '../../../api/APIKey';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/ContentContext';
import DeletePop from '../Popup/DeletePop';
import OAuthAccessTokenPopup from '../Popup/OAuthAccessTokenPopup';

const APIKeyGet = () => {
  const [apiKeys, setApiKeys] = useState({ totalRecords: 0, list: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false); 
  const [selectedAPIKey, setSelectedAPIKey] = useState(null); 
  const [isTokenPopupVisible, setIsTokenPopupVisible] = useState(false); 
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { canAPIKeyEdit, canAPIKeyNew } = useAuth();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const itemsPerPage = 10;

  useEffect(() => {
    const offset = (currentPage - 1) * itemsPerPage;

    const fetchApiKeys = async () => {
      setLoading(true);
      setError(null);
      try {
        const keys = await getAPIKey(offset, itemsPerPage);
        console.log(keys);
        setApiKeys(keys);
      } catch (error) {
        console.error('Error fetching API Keys:', error);
        setError('Error fetching API Keys');
      } finally {
        setLoading(false);
      }
    };

      fetchApiKeys();
  }, [ navigate, currentPage]);

  const totalRecords = apiKeys?.totalRecords || 0;
  const apiKeyList = apiKeys?.list || [];
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({ page: newPage });
    }
  };

  const navigateCreateAPIKey = () => {
    navigate('/dashboard/APIKey/Create');
  };

  const openDeletePopup = (apiKey) => {
    setSelectedAPIKey(apiKey); 
    setIsPopupVisible(true); 
  };

  const handleDeleteAPIKey = async () => {
    if (selectedAPIKey) {
      try {
        await deleteAPIKey(selectedAPIKey.id);
        const keys = await getAPIKey((currentPage - 1) * itemsPerPage, itemsPerPage);
        setApiKeys(keys);
      } catch (error) {
        console.error('Error deleting API Key:', error);
      } finally {
        setIsPopupVisible(false); 
        setSelectedAPIKey(null); 
      }
    }
  };

  const handleActive = async (id, active) => {
    await activeAPIKey(id, active); 
    const updatedKeys = apiKeyList.map((key) =>
      key.id === id ? { ...key, active: !key.active } : key
    );
    setApiKeys({ ...apiKeys, list: updatedKeys });
  };

  const openTokenPopup = (apiKey) => {
    setSelectedAPIKey(apiKey); 
    setIsTokenPopupVisible(true); 
  };

  const handleRenewToken = async (id) => {
    try {
      await activeAPIKey(id, true); 

    } catch (error) {
      console.error('Error renewing access token:', error);
    }
  };

  return (
    <ContentStyle>
      <div className="h-[30rem] bg-white rounded-3xl pb-44 p-6 box-content phone:overflow-x-auto tabletSmall:overflow-x-auto">
        <div className="flex phone:block justify-between items-center mb-2">
          <h1 className="mt-8 font-semibold text-2xl phone:mb-2">API Key Management</h1>
            <div className='flex-col mt-4'>
              <button
                onClick={() => window.open('https://apigateway.visionpay.com.au/swagger/index.html', '_blank')}
                className="mb-2 mr-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform"
              >
                API Reference
              </button>

              {canAPIKeyNew && (
                  <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    onClick={navigateCreateAPIKey}
                  >
                    New API Key +
                  </button>
                )}
          </div>
        </div>

        <table className="min-w-full mt-4 bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 text-left">  </th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Merchant</th>
              <th className="py-2 px-4 text-left">Date Created</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeyList.length > 0 ? (
              apiKeyList.map((apiKey) => (
                <tr key={apiKey.id} className="border-t">
                  <td>
                    <FaKey className={`ml-4 text-xl ${apiKey.active ? 'text-green-500' : 'text-gray-400'}`} />
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center space-x-3">
                      {canAPIKeyEdit ? (
                        <button
                          className="text-base font-medium text-blue-500 underline"
                          onClick={() => openTokenPopup(apiKey)}
                        >
                          {apiKey.name}
                        </button>
                      ) : (
                        <span className="text-base font-medium ml-3">{apiKey.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">{apiKey.description}</td>
                  <td className="py-2 px-4">{apiKey.merchantName}</td>
                  <td className="py-2 px-4">{new Date(apiKey.createdDateTime).toLocaleString('en-AU', { timeZone: 'Australia/Sydney', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')}</td>
                  <td className="py-2 px-4 flex items-center space-x-2">
                    <button 
                      onClick={() => handleActive(apiKey.id, !apiKey.active)} 
                      title={apiKey.active ? 'Click to deactivate' : 'Click to activate'}
                    >
                      <FaCheckCircle className={`text-xl ${apiKey.active ? 'text-green-500' : 'text-gray-300'}`} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => openDeletePopup(apiKey)} 
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No API Keys found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md transition ${
                    currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isPopupVisible && selectedAPIKey && (
        <DeletePop
          handleDelete={handleDeleteAPIKey}
          handleCancel={() => setIsPopupVisible(false)} 
          message={`Are you sure you want to delete ${selectedAPIKey.name}`} 
        />
      )}

      {isTokenPopupVisible && selectedAPIKey && (
        <OAuthAccessTokenPopup
          apiKey={selectedAPIKey}
          onClose={() => setIsTokenPopupVisible(false)}
          onRenew={handleRenewToken}
        />
      )}
    </ContentStyle>
  );
};

export default APIKeyGet;