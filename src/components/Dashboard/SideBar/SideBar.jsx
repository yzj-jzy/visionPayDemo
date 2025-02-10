import React, { useState, useEffect, useCallback } from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import visionPayLogo from '../../../assets/visionPayLogo.png';
import SideBarItem from './SideBarItem';
import { useAuth } from '../../../contexts/ContentContext'; 
import { useNavigate } from 'react-router-dom';
import { passwordRequest } from '../../../api/Authentication';
import { generalMenuItems, adminMenuItems } from './menuItems';

const SideBar = ({ openModal }) => {
    const [selected, setSelected] = useState(sessionStorage.getItem('selected') || ""); 
    const [selectedSubItem, setSelectedSubItem] = useState(sessionStorage.getItem('selectedSubItem') || null);
    const { userDetail, isSideBarOpen, setIsSideBarOpen } = useAuth();
    const navigate = useNavigate();

    const handleSidebarToggle = useCallback(() => {
        setIsSideBarOpen(!isSideBarOpen);
    }, [isSideBarOpen, setIsSideBarOpen]);

    const handleScreenResize = useCallback(() => {
        setIsSideBarOpen(window.innerWidth > 750);
    }, [setIsSideBarOpen]);

    const handlePassWordReset = useCallback(async () => {
        try {
            const passToken = await passwordRequest();
            if (passToken?.message) {
                navigate(`/PasswordResetForm?email=${userDetail?.userName}&code=${passToken.message}`);
            } else {
                console.error('Password reset token is missing.');
            }
        } catch (error) {
            console.error('Failed to reset password:', error.message);
        }
    }, [navigate, userDetail?.userName]);

    const handleItemClick = useCallback((content, hasSubItems) => {
        // Clear selectedSubItem when switching parent categories

        setSelected(selected === content ? "" : content);
        if (!hasSubItems) {
            sessionStorage.removeItem("selected");
            sessionStorage.removeItem("selectedSubItem");
            setSelectedSubItem(null);
            if (content === 'Dashboard') {
                navigate('/dashboard');
            } else if (content === 'Virtual Terminal') {
                navigate('/dashboard/Transaction/Create');
            } else {
                navigate(`/dashboard/${content}`);
            }
        }
    }, [navigate, selected]);

    const renderMenu = useCallback(
        (items) => items.map(({ icon, content, onClick, subItems, key }) => (
            <SideBarItem 
                key={content}
                icon={icon} 
                content={content} 
                isOpen={selected === content}
                onClick={() => (onClick ? onClick() : handleItemClick(content, !!subItems))}
                subItems={subItems}
                selectedSubItem={selectedSubItem}
                setSelectedSubItem={setSelectedSubItem}
                handleSubItemClick={(subKey) => handleNavigation(subKey)}
            />
        )),
        [handleItemClick, selected, selectedSubItem]
    );

    useEffect(() => {
        handleScreenResize();
        window.addEventListener('resize', handleScreenResize);
        return () => window.removeEventListener('resize', handleScreenResize);
    }, [handleScreenResize]);

    useEffect(() => {
        sessionStorage.setItem('selected', selected);
    }, [selected]);

    useEffect(() => {
        if (selectedSubItem) {
            sessionStorage.setItem('selectedSubItem', selectedSubItem);
        }
    }, [selectedSubItem]);

    const handleNavigation = (key) => {
        // Navigate to specific routes
        setSelectedSubItem(key);
        sessionStorage.setItem("selectedSubItem", key);

        switch (key) {
            case 'Users':
                navigate("/dashboard/Users");
                break;
            case 'Merchants':
                navigate("/dashboard/Merchant");
                break;
            case 'MerchantSetting':
                navigate("/dashboard/Merchant/Setting");
                break;
            case 'MerchantOverview':
                navigate("/dashboard/Merchant/Overview");
                break;
            case 'APIKeyManagement':
                navigate("/dashboard/APIKey");
                break;
            case 'Transactions':
                navigate("/dashboard/Transaction");
                break;
            case "ChangePassword":
                handlePassWordReset();
                break;
            case "dashboard":
                navigate("/dashboard");
                break;
            case "PaymentLink":
                navigate("/dashboard/Transaction/Link");
                break;
            default:
                break;
        }
    };

    return (
        <div className={`bg-blue-dashboard text-white transition-all duration-300 ease-in-out pt-12 pl-2 mr-8 h-full
            phone:absolute phone:z-20 phone:top-0 phone:left-0 
            phone:w-3/5 phoneLarge:w-2/5 tabletSmall:w-4/12 
            tabletLarge:w-3/12 desktop:w-2/12 desktopLarge:w-[12%]
            ${isSideBarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="relative">
                <div className="w-full pl-2 pr-2 mb-6 sidebar-container">
                    <img 
                        src={visionPayLogo} 
                        alt="VisionPay Logo" 
                        className="w-full h-auto object-contain"
                    />
                </div>

                <button 
                    className={`phone:block tablet:hidden desktop:hidden hidden absolute top-4 transform-gpu bg-blue-dashboard p-2 rounded-lg 
                                transition-transform duration-300 
                                ${isSideBarOpen ? 'right-[-36px]' : 'right-[-45px]'}`}
                    onClick={handleSidebarToggle}
                >
                    <FaBars />
                </button>
                <ul className="w-11/12 mt-8 space-y-8">
                    <li>
                        <h1 className="font-semibold">General</h1>
                        <div>{renderMenu(generalMenuItems(userDetail))}</div>
                    </li>
                    <li>
                        <h1 className="font-semibold">Admin</h1>
                        <div>{renderMenu(adminMenuItems(userDetail, handlePassWordReset))}</div>
                    </li>
                    <li className="mt-10">
                        <SideBarItem 
                            icon={<FaSignOutAlt />} 
                            content="Logout" 
                            onClick={openModal}
                        />
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBar;
