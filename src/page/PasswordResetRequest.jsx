import React, { useState } from 'react';
import InputBox from '../components/Login/InputBox';
import { passwordResetRequest } from '../api/Authentication';
import visionPayLogo from '../assets/VisionPayLogoWhite.jpg';
import { useNavigate } from 'react-router-dom';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [emailError, setEmailError] = useState('');

    // Simple email validation pattern xxx@xxxx
    const validateEmail = (email) => {
        const emailPattern = /@/;
        return emailPattern.test(email);
    };

    const handleEmailSubmit = async () => {
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setEmailError(''); // Clear error if email is valid
        try {
            await passwordResetRequest(email);
            setStep(2);
        } catch (error) {
            // email is not exist in backend
            setStep(2);
        }
    };

    const navigate = useNavigate();
    const toLogin = ()=>{
      navigate("/Login");
    }

    return (
        <div className="flex bg-login flex-col items-center justify-center h-screen">
            <div className="p-8 mb-8 rounded w-full max-w-lg mb-12 bg-white border border-gray-300 shadow-2xl">
                {step === 1 && (
                    <>
                        <div className="mb-6 text-center text-login-text">
                            <h3 className="text-login-text text-blue-700 font-bold text-3xl mb-2">Merchant Dashboard</h3>
                            <h3 className="text-login-text font-bold">Recover your account</h3>
                        </div>
                        <InputBox 
                            fieldName="Email Address" 
                            isRequired={true} 
                            placeholder="Enter your email address" 
                            type="email" 
                            onChange={setEmail}
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm mb-4">{emailError}</p>
                        )}
                        <button 
                            onClick={handleEmailSubmit}
                            className="bg-blue-500 mb-8 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                            Request password reset
                        </button>
                    </>
                )}
                {step === 2 && (
                    <div className="text-center">
                        <img className='mx-auto mb-6 w-1/2' src={visionPayLogo}></img>
                        <p className="text-login-text mb-4">Please check your email to continue.</p>
                        <p className='hover:text-blue-700 text-blue-500' onClick={toLogin}> Back to Login Page </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PasswordResetRequest;
