import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../contexts/ContentContext';

export default function MerchantSelector() {
  const { userDetail, selectedMerchant, setSelectedMerchant } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const merchantTmp = sessionStorage.getItem('selectedMerchant') || localStorage.getItem('selectedMerchant');
      // console.log(merchantTmp);
      if (userDetail?.subMerchants?.length > 0) {
        if (merchantTmp === null) {
          setSelectedMerchant(userDetail.subMerchants[0]);
          sessionStorage.setItem('selectedMerchant', JSON.stringify(userDetail.subMerchants[0]));
          localStorage.setItem('selectedMerchant', JSON.stringify(userDetail.subMerchants[0]));
        } else {
          const parsedMerchant = JSON.parse(merchantTmp);
          if (parsedMerchant.id !== selectedMerchant?.id) {
            setSelectedMerchant(parsedMerchant);
            sessionStorage.setItem('selectedMerchant', JSON.stringify(userDetail.subMerchants[0]));
            localStorage.setItem('selectedMerchant', JSON.stringify(userDetail.subMerchants[0]));
          }
        }
      }
    }
    console.log(userDetail.subMerchants);
  }, [userDetail, setSelectedMerchant]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleSelect = (merchant) => {
    setSelectedMerchant(merchant);
    sessionStorage.setItem('selectedMerchant', JSON.stringify(merchant));
    localStorage.setItem('selectedMerchant', JSON.stringify(merchant));
    console.log(localStorage.getItem('selectedMerchant'));
    setIsDropdownOpen(false);
    clearTimeout(timerRef.current);
  };

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  const memoizedMerchantName = useMemo(() => selectedMerchant?.name, [selectedMerchant?.name]);

  return (
    <div
      className="relative w-48 text-center mb-2"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="w-full flex items-center text-white justify-between bg-blue-dashboard border border-gray-300 rounded-lg px-4 py-2 shadow-sm cursor-pointer"
      >
        <span className="truncate text-md">
          {memoizedMerchantName || 'Select Merchant'}
        </span>
        <ChevronUpDownIcon className="h-5 w-5 ml-2" aria-hidden="true" />
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
          <ul className="max-h-60 overflow-auto py-1 text-sm">
            {userDetail?.subMerchants.map((merchant) => (
              <li
                key={merchant.id}
                onClick={() => handleSelect(merchant)}
                className="cursor-pointer select-none px-4 py-2 text-gray-900 hover:bg-indigo-600 hover:text-white flex items-center justify-between"
              >
                <span className="truncate flex-1">{merchant.name}</span>
                {selectedMerchant?.id === merchant.id && (
                  <CheckIcon className="h-5 w-5 text-indigo-600 ml-2" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
