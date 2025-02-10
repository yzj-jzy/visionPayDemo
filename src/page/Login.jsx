import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputBox from '../components/Login/InputBox';
import LoginLogo from '../assets/VisionPayLogin.jpg';
import Footer from '../components/Footer/Footer';
import { login } from '../api/Authentication'; 
import LoadingModal from '../components/LoadingModal';
import VisionPayLogoWhite from '../assets/VisionPayLogoWhite.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(localStorage.getItem('cookieConsent') === 'true');
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
    personalization: true,
    functional: true,
  });

  // Function to validate email
  const validateEmail = (email) => {
    const emailRegex = /@/;
    return emailRegex.test(email);
  };

  // Function to handle login
  const handleLogin = async () => {
    setErrorMessage('');
    if (!userName || !password) {
      setErrorMessage('Email and password are required');
      return;
    }
    if (!validateEmail(userName)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    setIsLoading(true);  // Start loading
    try {
      const tokenInfo = await login(userName, password);
      if (tokenInfo.token) {
        navigate('/dashboard');
      } else {
        setErrorMessage("Invalid Attempt");
      }
    } catch (error) {
      setErrorMessage("Invalid Attempt");
    } finally {
      setIsLoading(false);  // End loading
    }
  };

  const showCookieConsent = () => {
    const consentCard = document.createElement('div');
    consentCard.className = 'fixed bottom-4 left-4 bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-96';
    consentCard.style.zIndex = '1000';
    consentCard.innerHTML = `
      <p class="text-sm mb-2 font-bold">We use cookies</p>
      <p class="text-sm mb-4">Our website uses cookies for essential services, functionality, advertising, and analytics. By clicking accept, you consent to our use of these tools.</p>
      <div class="flex justify-between mt-4 gap-4">
        <button class="text-blue-600 hover:underline" id="preferencesButton">Preferences</button>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" id="acceptCookies">Accept</button>
      </div>
      <div id="preferencesContent" class="hidden mt-4 border-t pt-4">
        <div class="mb-4">
          <label class="flex items-center">
            <input type="checkbox" id="essential" checked disabled class="mr-2" />
            Essential Features (mandatory)
          </label>
        </div>
      </div>
    `;
    document.body.appendChild(consentCard);
  
    // Accept button functionality
    consentCard.querySelector('#acceptCookies').onclick = handleAccept;
  
    // Preferences button functionality
    const preferencesButton = consentCard.querySelector('#preferencesButton');
    const preferencesContent = consentCard.querySelector('#preferencesContent');
    preferencesButton.addEventListener('click', () => {
      preferencesContent.classList.toggle('hidden');
    });
  };
  
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setCookiesAccepted(true);
    const consentCard = document.querySelector('.fixed.bottom-4.left-4');
    if (consentCard) {
      consentCard.remove();
    }
  };
  
  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      showCookieConsent();
    }
  }, []);
  

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {isLoading && <LoadingModal message="Logging in, please wait..." />}
      <div className="flex items-center justify-center rounded-lg p-4 w-full hidden phone:block">
        <img src={VisionPayLogoWhite} alt="VisionPay Logo" className="max-w-full rounded-lg p-4" />
      </div>
      
      <div className="flex bg-white border border-gray-300 shadow-2xl rounded-lg max-w-3xl mx-auto w-full">
        <div className="w-1/2 flex items-center justify-center p-8 phone:hidden">
          <img src={LoginLogo} alt="VisionPay Logo" className="max-w-full rounded-lg" />
        </div>
      
        <div className="w-1/2 p-8 phone:w-full">
          <div className="mb-6 text-center text-login-text">
            <h3 className="text-login-text font-bold">Merchant Dashboard</h3>
          </div>

          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              {errorMessage}
            </div>
          )}
          
          <div className="mb-4"> 
            <InputBox 
              fieldName="Email Address" 
              isRequired={true} 
              placeholder="Enter your Email address" 
              value={userName} 
              onChange={setUserName} 
              type="email" 
            />
          </div>

          <div className=''>
            <InputBox 
              fieldName="Password" 
              isRequired={true} 
              placeholder="***************" 
              value={password} 
              onChange={setPassword} 
              type="password" 
            />
          </div>

          <div className="flex items-center justify-between mb-8 mt-[-8px]">
            <Link to="/PasswordResetRequest" className="text-sm text-blue-600 hover:underline">Forgotten password?</Link>
          </div>
          
          <button 
            className="bg-blue-500 mb-8 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>

      <Footer startYear={2020} endYear={2024} versionNumber={"1.0.8"} companyName={"VisionPay"} />
    </div>
  );
};

export default Login;