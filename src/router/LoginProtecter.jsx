import React, { useEffect, useState } from 'react';
import { extendSession } from '../api/Authentication';
import { Navigate } from 'react-router-dom';
import ExtendPop from '../components/Dashboard/Popup/ExtendPop';

const LoginProtecter = ({ children }) => {

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  // const token = localStorage.getItem('token');
  // const expiryDate = localStorage.getItem('expiryDate');
  const token = getCookie('token');
  const expiryDate = getCookie('expiryDate');

  const [isTokenExpiring, setIsTokenExpiring] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleExtendSession = async () => {
    try {
      await extendSession();
      setIsTokenExpiring(false); // Reset the state after extending session
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!token || !expiryDate) return;

    const expiryTimestamp = new Date(expiryDate).getTime();
    const checkTokenValidity = () => {
      const timeRemaining = expiryTimestamp - Date.now();
      if (timeRemaining <= 5 * 60 * 1000 && timeRemaining > 0) {
        setIsTokenExpiring(true);
      } else if (timeRemaining <= 0) {
        // localStorage.removeItem('token');
        // localStorage.removeItem('expiryDate');
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "expiryDate=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        setRedirectToLogin(true);
      } else {
        setIsTokenExpiring(false);
      }
    };

    checkTokenValidity(); // Initial check
    const intervalId = setInterval(checkTokenValidity, 10000); // Regular check

    return () => clearInterval(intervalId);
  }, [token, expiryDate]);

  if (redirectToLogin) {
    return <Navigate to="/Login" replace />;
  }

  if (!token || !expiryDate) {
    return <Navigate to="/Login" replace />;
  }

  return (
    <>
      {isTokenExpiring && (
        <ExtendPop
          handleExtendSession={handleExtendSession}
          setIsTokenExpiring={setIsTokenExpiring}
        />
      )}
      {children}
    </>
  );
};

export default LoginProtecter;
