import React, { useState } from 'react';
import SideBar from '../components/Dashboard/SideBar/SideBar';
import LogoutModal from '../components/Login/Modal/LogoutModal';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Initially collapsed

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  return (
    <div className="bg-blue-dashboard flex relative min-h-screen phone:h-[150%]">
      <SideBar openModal={openLogoutModal} isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Outlet />
      <LogoutModal isOpen={isLogoutModalOpen} closeModal={closeLogoutModal} />
    </div>
  );
};

export default Dashboard;
