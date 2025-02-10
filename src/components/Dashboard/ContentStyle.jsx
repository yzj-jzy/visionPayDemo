import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/ContentContext';
import MerchantSelector from './MerchantSelector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContentStyle({ children }) {
  const { userDetail, loading, setIsSideBarOpen } = useAuth();
  const closeSideBar = () =>{
    if(innerWidth<=750){
      setIsSideBarOpen(false);
    }
  }

  return (
    <div className="overflow-x-auto p-6 w-full lg:w-11/12 h-full z-10z" onClick={closeSideBar}>
      <div className='hidden phone:block text-white border-b mb-4'>
        VisionPay
      </div>

      <div className="flex justify-between items-start">
        <div className="flex-grow"></div>
        <div className="text-white text-right flex flex-col items-end">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className='mb-2 text-md'>{userDetail?.userName} ({userDetail?.role})</p>
              <MerchantSelector userDetail={userDetail} />
            </>
          )}
        </div>
      </div>

      <div>
      <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="w-96 max-w-full p-4 text-lg bg-white shadow-md rounded-lg"
            style={{ width: '32rem' }}
          />
        {children}
      </div>
    </div>
  );
}
