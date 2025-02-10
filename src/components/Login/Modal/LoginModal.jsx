import React, { useEffect, useRef } from 'react';
import visionPayLogin from '../../../assets/visionPayLogin.jpg';

const LoginModal = ({ isOpen, closeModal }) => {
    const emailRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            emailRef.current.focus();
        }

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
            <div className="relative w-full phone:w-full max-w-4xl md:max-w-2xl lg:max-w-4xl bg-white rounded-lg shadow-lg flex flex-col phone:flex-row sm:flex-row overflow-hidden mt-12 md:mt-0">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-3xl"
                    aria-label="Close modal"
                >
                    &times;
                </button>
                <div className="flex phone:pl-5 phone:pr-2 phone:py-8
                                     tablet:pl-20 tablet:pr-8 tablet:py-20
                                     desktop:pl-20 desktop:pr-8 desktop:py-20">
                    <img src={visionPayLogin} alt="Login illustration" className="phone:object-contain object-cover w-full h-full rounded-lg" />
                </div>
                <div className="flex w-full p-6 md:w-1/2 lg:w-5/12 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Merchant Dashboard</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
                                Email address *
                            </label>
                            <input
                                ref={emailRef}
                                className="appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="email"
                                type="text"
                                placeholder="Enter your email address"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
                                Password *
                            </label>
                            <input
                                className="appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                id="password"
                                type="password"
                                placeholder="Password"
                            />
                        </div>
                        <div className="mb-6 flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox text-indigo-600"
                                id="rememberMe"
                            />
                            <label className="ml-2 text-sm text-gray-700" htmlFor="rememberMe">
                                Remember me?
                            </label>
                        </div>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="button"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
