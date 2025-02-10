import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ContentStyle from '../ContentStyle';
import { getUserById, EditUser } from '../../../api/User';
import { useAuth } from '../../../contexts/ContentContext';
import ErrorPopup from '../Popup/ErrorPop';
import MerchantSelectionPopup from '../Popup/MerchantSelectPopup';

const UserEdit = () => {
    const { userDetail, availableMerchants, canUserEdit } = useAuth();
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedSubMerchants, setSelectedSubMerchants] = useState([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showMerchantPopup, setShowMerchantPopup] = useState(false); 
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");

    const roleOptions = [];
    if (userDetail && userDetail.role === 'SuperUser') {
        roleOptions.push({ value: 'SuperUser', label: 'SuperUser' });
        roleOptions.push({ value: 'Admin', label: 'Admin' });
        roleOptions.push({ value: 'User', label: 'User' });
    } else if (userDetail && userDetail.role === 'Admin') {
        roleOptions.push({ value: 'Admin', label: 'Admin' });
        roleOptions.push({ value: 'User', label: 'User' });
    } else if (userDetail && userDetail.role === 'User') {
        roleOptions.push({ value: 'User', label: 'User' });
    }

    useEffect(() => {
        if (roleOptions.length > 0 && !selectedRole) {
            setSelectedRole(roleOptions[0].value);
        }
    }, [roleOptions]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserById(userId);
                console.log(user)
                setSelectedRole(user.role);
                setEmail(user.userName);
                setSelectedSubMerchants(user.subMerchants);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, [userId, canUserEdit, navigate]);
    const handleRoleChange = (e) => setSelectedRole(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedRole !== 'SuperUser' && selectedSubMerchants.length === 0) {
            setErrorMessage('User needs to be linked to a Merchant.');
            setShowErrorPopup(true);
            return;  
        }
    
        try {
            const newUser = {
                userName: email,
                role: selectedRole,
                subMerchants: selectedRole !== 'SuperUser' ? selectedSubMerchants : []
            };
    
            await EditUser(userId, newUser.role, newUser.subMerchants);
            navigate('/dashboard/Users');
        } catch (error) {
            console.error('Error editing user:', error);
            setErrorMessage('Failed to edit user: ' + error.message);
            setShowErrorPopup(true);
        }
    };
    
    const openMerchantPopup = () => {
        setShowMerchantPopup(true); 
    };

    const handleMerchantSelection = (selectedMerchants) => {
        setSelectedSubMerchants(selectedMerchants); 
        setShowMerchantPopup(false); 
    };
    const handleDeleteMerchant = (merchantId) => {
        setSelectedSubMerchants((prevMerchants) =>
            prevMerchants.filter((merchant) => merchant.id !== merchantId)
        );
    };
    

    return (
        <ContentStyle>
            <div className="h-96 bg-white rounded-3xl  pb-44 p-6  box-content pt-12 phone:overflow-x-auto tabletSmall:overflow-x-auto">    
                <div className="relative bg-white mt-12 pb-24 overflow-x-auto box-content max-w-4xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6"> User Detail</h1>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex flex-wrap gap-6">
                            {/* Left column - Email and Role */}
                            <div className="w-full ml-1 lg:w-1/2 flex-1 min-w-[250px]">
                                {/* Email Input */}
                                <div className="mb-6">
                                    <div className="relative">
                                        <p className="block text-sm font-semibold text-gray-600 mb-2">Email:</p>
                                        <p className="block w-full px-4 py-3 rounded-lg sm:text-base transition duration-150 ease-in-out">{email}</p>
                                    </div>
                                </div>
                                {/* Role Select */}
                                <div className="mb-6">
                                <label htmlFor="role" className="block text-sm font-semibold text-gray-600 mb-2">Role:</label>
                                <div className="relative ml-1">
                                    <select
                                    id="role"
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-base appearance-none transition duration-150 ease-in-out"
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                    required
                                    >
                                    {roleOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                    </select>
                                    <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.94 6.94a1.5 1.5 0 012.12 0L10 11.88l4.94-4.94a1.5 1.5 0 112.12 2.12l-6 6a1.5 1.5 0 01-2.12 0l-6-6a1.5 1.5 0 010-2.12z" />
                                    </svg>
                                    </span>
                                </div>
                                </div>

                                {/* Create User Button */}
                                <div className="w-full mt-8">
                                    <button
                                        type="submit"
                                        className="w-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg shadow-md text-base font-semibold transition duration-150 ease-in-out"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>

                            {/* Right column - Merchant Table */}
                            <div className="w-full lg:w-1/2 flex-1 min-w-[250px]">
                                {selectedRole !== 'SuperUser' && (
                                    <div className="bg-white shadow rounded-lg">
                                        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-t-lg">
                                            <h2 className="text-lg font-semibold text-gray-700">Merchants</h2>
                                            <button
                                                type="button"
                                                className="inline-flex items-center justify-center p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onClick={openMerchantPopup}
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="overflow-y-auto max-h-64">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                                            Name
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {selectedSubMerchants.map((merchant) => (
                                                        <tr key={merchant.id}>
                                                            <td className="px-6 py-4 text-sm text-gray-800">{merchant.name}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button
                                                                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                                                                    onClick={() => handleDeleteMerchant(merchant.id)}
                                                                >
                                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h1v10a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm3 4a1 1 0 012 0v8a1 1 0 11-2 0V6z" />
                                                                    </svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {selectedSubMerchants.length === 0 && (
                                                        <tr>
                                                            <td className="px-6 py-4 text-sm text-gray-500" colSpan="2">
                                                                No merchants selected.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

                <div>

                {/* Error popup */}
                {showErrorPopup && <ErrorPopup message={errorMessage} setShowErrorPopup={setShowErrorPopup} />}

                {/* Merchant selection popup */}
                {showMerchantPopup && (
                    <MerchantSelectionPopup
                    selectedMerchants={selectedSubMerchants}
                    availableMerchants={availableMerchants}
                    onSelect={handleMerchantSelection}
                    onClose={() => setShowMerchantPopup(false)}
                    />
                )}
                </div>
        </ContentStyle>
    );
};

export default UserEdit;
