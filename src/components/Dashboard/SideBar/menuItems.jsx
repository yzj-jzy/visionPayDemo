import { FaTachometerAlt, FaUser,FaStore,FaHandHoldingUsd, FaCreditCard, FaCog, FaLink, FaDesktop, FaEye, FaCogs, FaKey, FaUsers, FaLock } from 'react-icons/fa';

export const generalMenuItems = (userDetail) => [
  { icon: <FaTachometerAlt />, content: "Dashboard" },
  {
    icon: <FaHandHoldingUsd />,
    content: "Payments",
    subItems: [
      userDetail?.claims?.some(claim => claim.type === 'Transaction' && claim.value === 'List') && { icon: <FaCreditCard />, content: "Transactions", key: "Transactions" },
      userDetail?.claims?.some(claim => claim.type === 'Transaction' && claim.value === 'Link') && { icon: <FaLink />, content: "Create Payment Link", key: "PaymentLink" }
    ].filter(Boolean)
  },
  userDetail?.claims?.some(claim => claim.type === 'Transaction' && claim.value === 'New') && {
    icon: <FaDesktop />,
    content: "Virtual Terminal",
    key: "Virtual Terminal"
  }
];

export const adminMenuItems = (userDetail) => [
  { 
    icon: <FaUser />, 
    content: "Account",
    subItems: [
      userDetail?.claims?.some(claim => claim.type === 'SubMerchant' && claim.value === 'Overview') && { icon: <FaEye />, content: "Overview", key: "MerchantOverview" },
      userDetail?.claims?.some(claim => claim.type === 'SubMerchant' && claim.value === 'List') && { icon: <FaStore />, content: "Merchants", key: "Merchants" },
      userDetail?.claims?.some(claim => claim.type === 'User' && claim.value === 'List') && { icon: <FaUsers />, content: "Users", key: "Users" },
      { icon: <FaLock />, content: "Change Password", key: "ChangePassword" }
    ].filter(Boolean)
  },
  { 
    icon: <FaCog />, 
    content: "Settings",
    subItems: [
      userDetail?.claims?.some(claim => claim.type === 'SubMerchant' && claim.value === 'Settings') && { icon: <FaCogs />, content: "Merchant", key: "MerchantSetting" },
      userDetail?.claims?.some(claim => claim.type === 'APIKey' && claim.value === 'List') && { icon: <FaKey />, content: "API Key Management", key: "APIKeyManagement" }
    ].filter(Boolean)
  }
];
