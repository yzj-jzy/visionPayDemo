import React, { useEffect } from 'react';

const LogoutModal = ({ isOpen, closeModal }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative w-[90%] max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Close Button */}
                <div className="absolute top-4 right-4 cursor-pointer" onClick={closeModal}>
                    <span className="text-gray-500 text-xl font-bold">&times;</span>
                </div>

                {/* Modal Header */}
                <div className="p-6 text-center">
                    <h2 className="text-red-500 text-lg font-semibold mb-4">Logout confirmation</h2>

                    {/* Modal Body */}
                    <p className="text-center text-gray-800 mb-8">
                        Are you sure you want to log out from your account?
                    </p>

                    {/* Buttons */}
                    <div className="flex justify-center space-x-4">
                        <button
                            className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-lg"
                            onClick={() => {
                                closeModal();
                                // localStorage.removeItem('token');
                                // localStorage.removeItem('expiryDate');
                                localStorage.removeItem('userId');
                                document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                                document.cookie = "expiryDate=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";    
                                sessionStorage.clear();                    
                                window.location.href = '/Login';
                            }}
                        >
                            Yes
                        </button>
                        <button
                            onClick={closeModal}
                            className="bg-gray-400 hover:bg-gray-300 text-white py-2 px-6 rounded-lg"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
