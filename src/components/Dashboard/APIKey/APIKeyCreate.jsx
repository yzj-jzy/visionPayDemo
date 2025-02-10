import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentStyle from '../ContentStyle';
import { createAPIKey } from '../../../api/APIKey';
import { useAuth } from '../../../contexts/ContentContext';
import ErrorPopup from '../Popup/ErrorPop';

const APIKeyCreate = () => {
    const { canUserNew, userDetail, availableMerchants } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    
    const [selectedMerchant, setSelectedMerchant] = useState(
        availableMerchants.length > 0 ? availableMerchants[0].id : ''
    );
    
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showMerchantPopup, setShowMerchantPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!canUserNew) {
            navigate("/dashboard");
        }
    }, [canUserNew, navigate]);

    const handleNameChange = (e) => setName(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleMerchantChange = (e) => setSelectedMerchant(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !description || !selectedMerchant) {
            setErrorMessage('All fields are required.');
            setShowErrorPopup(true);
            return;
        }

        try {
            const newAPIKey = {
                name,
                description,
                merchant: selectedMerchant,
            };
            const result = await createAPIKey(newAPIKey.name, newAPIKey.description, newAPIKey.merchant);
            navigate('/dashboard/APIKey');
        } catch (error) {
            console.error('Error creating API key:', error);
            setErrorMessage('Failed to create API key: ' + error.message);
            setShowErrorPopup(true);
        }
    };

    return (
        <ContentStyle>
            <div className="h-96 phone:overflow-x-auto tabletSmall:overflow-x-auto bg-white rounded-3xl pb-44 p-6 box-content">
                <div className="relative bg-white mt-6 pb-24 lg:w-1/3 overflow-x-auto box-content max-w-4xl lg:ml-24 px-8">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">New API Key</h1>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex flex-wrap gap-6">
                            {/* Name Input */}
                            <div className="w-full ml-1 lg:w-1/2 flex-1 min-w-[250px]">
                                <div className="mb-6">
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-600 mb-2">Name:</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="name"
                                            autoComplete="off"
                                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-base transition duration-150 ease-in-out"
                                            value={name}
                                            onChange={handleNameChange}
                                            maxLength={25}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Description Input */}
                                <div className="mb-6">
                                    <label htmlFor="description" className="block text-sm font-semibold text-gray-600 mb-2">Description:</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="description"
                                            autoComplete="off"
                                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-base transition duration-150 ease-in-out"
                                            value={description}
                                            onChange={handleDescriptionChange}
                                            maxLength={250}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Merchant Select */}
                                <div className="mb-6">
                                    <label htmlFor="merchant" className="block text-sm font-semibold text-gray-600 mb-2">Merchant:</label>
                                    <div className="relative ml-1">
                                        <select
                                            id="merchant"
                                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-base appearance-none transition duration-150 ease-in-out"
                                            value={selectedMerchant}
                                            onChange={handleMerchantChange}
                                            required
                                        >
                                            {availableMerchants.map((merchant) => (
                                                <option key={merchant.id} value={merchant.id}>{merchant.name}</option>
                                            ))}
                                        </select>
                                        <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.94 6.94a1.5 1.5 0 012.12 0L10 11.88l4.94-4.94a1.5 1.5 0 112.12 2.12l-6 6a1.5 1.5 0 01-2.12 0l-6-6a1.5 1.5 0 010-2.12z" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>

                                {/* Create API Key Button */}
                                <div className="w-full mt-8">
                                    <button
                                        type="submit"
                                        className="w-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md text-base font-semibold transition duration-150 ease-in-out"
                                    >
                                        Create API Key
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Error popup */}
            {showErrorPopup && <ErrorPopup message={errorMessage} setShowErrorPopup={setShowErrorPopup} />}
        </ContentStyle>
    );
};

export default APIKeyCreate;
