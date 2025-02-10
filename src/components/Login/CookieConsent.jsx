// CookieConsent.js
import React, { useState, useEffect } from 'react';

const CookieConsent = ({ onAccept, preferences, setPreferences }) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent') === 'true';
    if (savedConsent) {
      onAccept();
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    onAccept();
  };

  const handleSavePreferences = () => {
    setPreferences(localPreferences); // Save preferences to parent state
    handleAccept(); // Treat saving preferences as accepting cookies
  };

  const togglePreference = (key) => {
    setLocalPreferences((prevPreferences) => ({
      ...prevPreferences,
      [key]: !prevPreferences[key],
    }));
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-96 z-50">
      <p className="text-sm mb-2 font-bold">We use cookies</p>
      <p className="text-sm mb-4">Our website uses cookies for essential services, functionality, advertising, and analytics. By clicking accept, you consent to our use of these tools.</p>
      <div className="flex justify-between mt-4 gap-4">
        <button className="text-blue-600 hover:underline" onClick={() => setShowPreferences(!showPreferences)}>Preferences</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" onClick={handleAccept}>Accept</button>
      </div>
      
      {showPreferences && (
        <div className="mt-4 border-t pt-4">
          <div className="mb-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={localPreferences.analytics} 
                onChange={() => togglePreference('analytics')} 
                className="mr-2" 
              />
              Analytics
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={localPreferences.marketing} 
                onChange={() => togglePreference('marketing')} 
                className="mr-2" 
              />
              Marketing
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={localPreferences.personalization} 
                onChange={() => togglePreference('personalization')} 
                className="mr-2" 
              />
              Personalization
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={localPreferences.functional} 
                onChange={() => togglePreference('functional')} 
                className="mr-2" 
              />
              Functional
            </label>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" onClick={handleSavePreferences}>Save Preferences</button>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
