import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserDetail } from '../api/Authentication';
import { getUser } from '../api/User';

const AuthContext = createContext();
const UserContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function useUser() {
  return useContext(UserContext);
}

// Helper function to extract permissions from claims
const extractPermissions = (claims) => {
  const permissions = {
    canUserList: false,
    canUserNew: false,
    canUserEdit: false,
    canUserDelete: false,
    canSubMerchantOverview: false,
    canSubMerchantSettings: false,
    canSubMerchantList: false,
    canSubMerchantNew: false,
    canSubMerchantEdit: false,
    canSubMerchantDelete: false,
    canAPIKeyList: false,
    canAPIKeyNew: false,
    canAPIKeyEdit: false,
    canAPIKeyDelete: false,
    canTransactionList: false,
    canTransactionView: false,
    canTransactionRefund: false,
    canTransactionLink: false,
    canTransactionNew: false,
  };

  claims.forEach((claim) => {
    switch (claim.type) {
      case 'User':
        if (claim.value === 'List') permissions.canUserList = true;
        if (claim.value === 'New') permissions.canUserNew = true;
        if (claim.value === 'Edit') permissions.canUserEdit = true;
        if (claim.value === 'Delete') permissions.canUserDelete = true;
        break;
      case 'SubMerchant':
        if (claim.value === 'Overview') permissions.canSubMerchantOverview = true;
        if (claim.value === 'Settings') permissions.canSubMerchantSettings = true;
        if (claim.value === 'List') permissions.canSubMerchantList = true;
        if (claim.value === 'New') permissions.canSubMerchantNew = true;
        if (claim.value === 'Edit') permissions.canSubMerchantEdit = true;
        if (claim.value === 'Delete') permissions.canSubMerchantDelete = true;
        break;
      case 'APIKey':
        if (claim.value === 'List') permissions.canAPIKeyList = true;
        if (claim.value === 'New') permissions.canAPIKeyNew = true;
        if (claim.value === 'Edit') permissions.canAPIKeyEdit = true;
        if (claim.value === 'Delete') permissions.canAPIKeyDelete = true;
        break;
      case 'Transaction':
        if (claim.value === 'List') permissions.canTransactionList = true;
        if (claim.value === 'View') permissions.canTransactionView = true;
        if (claim.value === 'New') permissions.canTransactionNew = true;
        if (claim.value === 'Link') permissions.canTransactionLink = true;
        if (claim.value === 'Refund') permissions.canTransactionRefund = true;
      default:
        break;
    }
  });

  return permissions;
};

export const AuthProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});
  const [availableMerchants, setAvailableMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const loadUserDetail = async () => {
    try {
      const response = await getUserDetail();
      setUserDetail(response);
  
      let selectedMerchant = sessionStorage.getItem('selectedMerchant');
      // console.log(localStorage.getItem('selectedMerchant'));
      if (!selectedMerchant) {
        selectedMerchant = localStorage.getItem('selectedMerchant');
      }
  
      if (!selectedMerchant && response.subMerchants.length > 0) {
        selectedMerchant = response.subMerchants[0];
      } else if (selectedMerchant) {
        selectedMerchant = JSON.parse(selectedMerchant);
      }
  
      setSelectedMerchant(selectedMerchant);
      sessionStorage.setItem('selectedMerchant', JSON.stringify(selectedMerchant));
  
      const extractedPermissions = extractPermissions(response.claims);
      setPermissions(extractedPermissions);
      setAvailableMerchants(response.subMerchants);
    } catch (error) {
      console.error('Failed to load user details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUserDetail();
  }, []);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      userDetail, 
      ...permissions, 
      availableMerchants, 
      loading, 
      loadUserDetail,
      selectedMerchant, 
      setSelectedMerchant, 
      isSideBarOpen, 
      setIsSideBarOpen 
  }}>
    {children}
  </AuthContext.Provider>
  
  );
};
