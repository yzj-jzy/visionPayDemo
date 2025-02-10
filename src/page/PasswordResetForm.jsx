import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InputBox from '../components/Login/InputBox';
import { passwordReset } from '../api/Authentication';

const PasswordResetForm = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [step, setStep] = useState(3);  

    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search.replace(/\?/g, '&').substring(1));
    const email = searchParams.get('email');
    const code = searchParams.get('code');
    let userId = searchParams.get('userId') || localStorage.getItem('userId'); 

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);
        }
        if (!email || !code) {
            navigate('/login');
        }
    }, [email, code, userId, navigate]);

    // Password validation function
    const validatePassword = (password) => {
        const minLength = 6;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);

        if (password.length < minLength) {
            setErrorMessage(`Password must be at least ${minLength} characters long`);
            return false;
        }
        if (!hasSpecialChar) {
            setErrorMessage("Password must contain at least 1 special character (e.g., !@#$%^&*)");
            return false;
        }
        if (!hasDigit) {
            setErrorMessage("Password must contain at least 1 digit (0-9)");
            return false;
        }
        if (!hasUpperCase) {
            setErrorMessage("Password must contain at least 1 uppercase letter (A-Z)");
            return false;
        }
        if (!hasLowerCase) {
            setErrorMessage("Password must contain at least 1 lowercase letter (a-z)");
            return false;
        }
        return true;
    };

    const handlePasswordReset = async () => {
        setErrorMessage('');  
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        // Validate the new password
        if (!validatePassword(newPassword)) {
            return;
        }

        try {

            await passwordReset(email, code, newPassword, userId);
            setStep(4);  
        } catch (error) {
            setErrorMessage("Password reset failed: " + error.message);
        }
    };

    return (
        <div className="flex bg-login flex-col items-center justify-center h-screen">
            <div className="p-8 mb-8 rounded w-full max-w-lg mb-12 bg-white border border-gray-300 shadow-2xl">
                {errorMessage && (
                    <div className="mb-4 p-4 bg-red-100 text-red-600 border border-red-400 rounded">
                        {errorMessage}
                    </div>
                )}
                {step === 3 && (
                    <>
                        <div className="mb-6 text-center text-login-text">
                            <h3 className="text-login-text text-blue-700 font-bold text-3xl mb-2">Reset Your Password</h3>
                        </div>
                        <label className="block text-login-text text-gray-700 text-sm mb-2 w-36">
                            Email
                        </label>
                        <p className="mb-2">
                            {email} 
                        </p>
                        <InputBox 
                            fieldName="New Password" 
                            isRequired={true} 
                            placeholder="Enter your new password" 
                            type="password"
                            value={newPassword}
                            onChange={setNewPassword}
                        />
                        <InputBox 
                            fieldName="Confirm Password" 
                            isRequired={true} 
                            placeholder="Confirm your new password" 
                            type="password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                        />
                        <button 
                            onClick={handlePasswordReset}
                            className="bg-blue-500 mb-8 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                            Reset Password
                        </button>
                    </>
                )}
                {step === 4 && (
                    <div className="text-center">
                        <p className="text-green-500 text-lg mb-4">Your password has been reset successfully.</p>
                        <button 
                            onClick={() => navigate('/login')} 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordResetForm;
