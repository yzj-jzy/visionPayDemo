import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/ContentContext';

const ResourceProtecter = ({ resourceName, actionType, children }) => {
  const { 
    canUserList, canUserNew, canUserEdit, canUserDelete,
    canSubMerchantOverview, canSubMerchantSettings, canSubMerchantList,
    canSubMerchantNew, canSubMerchantEdit, canSubMerchantDelete,
    canAPIKeyList, canAPIKeyNew, canAPIKeyEdit, canAPIKeyDelete,
    canTransactionList, canTransactionView, canTransactionRefund,
    canTransactionLink, canTransactionNew,
  } = useAuth();

  const checkPermission = () => {
      switch (resourceName) {
        case 'User':
          return (
            (actionType === 'List' && canUserList) ||
            (actionType === 'New' && canUserNew) ||
            (actionType === 'Edit' && canUserEdit) ||
            (actionType === 'Delete' && canUserDelete)
          );
        case 'SubMerchant':
          return (
            (actionType === 'Overview' && canSubMerchantOverview) ||
            (actionType === 'Settings' && canSubMerchantSettings) ||
            (actionType === 'List' && canSubMerchantList) ||
            (actionType === 'New' && canSubMerchantNew) ||
            (actionType === 'Edit' && canSubMerchantEdit) ||
            (actionType === 'Delete' && canSubMerchantDelete)
          );
        case 'APIKey':
          return (
            (actionType === 'List' && canAPIKeyList) ||
            (actionType === 'New' && canAPIKeyNew) ||
            (actionType === 'Edit' && canAPIKeyEdit) ||
            (actionType === 'Delete' && canAPIKeyDelete)
          );
        case 'Transaction':
          return (
            (actionType === 'List' && canTransactionList) ||
            (actionType === 'View' && canTransactionView) ||
            (actionType === 'New' && canTransactionNew) ||
            (actionType === 'Link' && canTransactionLink) ||
            (actionType === 'Refund' && canTransactionRefund)
          );
        default:
          return false;
      }
    };

  
  if (!checkPermission()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ResourceProtecter;
