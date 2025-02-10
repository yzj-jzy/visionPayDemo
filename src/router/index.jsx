import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashBoard from '../page/DashBoard';
import Login from '../page/Login';
import PasswordResetRequest from '../page/PasswordResetRequest';
import PasswordResetForm from '../page/PasswordResetForm';
import LoginProtecter from './LoginProtecter';
import ResourceProtecter from './ResourceProtecter';
import '../index.css';

import { AuthProvider } from '../contexts/ContentContext';
import Home from '../components/Dashboard/Home/Home';
import NotFound from '../components/Dashboard/NotFound';

import UserGet from '../components/Dashboard/User/UserGet';
import UserCreate from '../components/Dashboard/User/UserCreate';
import UserEdit from '../components/Dashboard/User/UserEdit';

import SubMerchantGet from '../components/Dashboard/SubMerchant/SubMerchantGet';
import SubMerchantSetting from '../components/Dashboard/SubMerchant/SubMerchantSetting';
import SubMerchantOverview from '../components/Dashboard/SubMerchant/SubMerchantOverview';
import SubMerchantCreate from '../components/Dashboard/SubMerchant/SubMerchantCreate';
import SubMerchantEdit from '../components/Dashboard/SubMerchant/SubMerchantEdit';

import APIKeyGet from '../components/Dashboard/APIKey/APIKeyGet';
import APIKeyCreate from '../components/Dashboard/APIKey/APIKeyCreate';

import TransactionGet from '../components/Dashboard/Transaction/TransactionGet';
import TransactionView from '../components/Dashboard/Transaction/TransactionView';
import TransactionCreate from '../components/Dashboard/Transaction/TransactionCreate';
import PaymentLink from '../components/Dashboard/Transaction/PaymentLink';

// Helper function to wrap routes in ResourceProtecter
const protectedRoute = (Component, resourceName, actionType) => (
  <ResourceProtecter resourceName={resourceName} actionType={actionType}>
    {Component}
  </ResourceProtecter>
);

// Routes configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/Login" replace />
  },
  {
    path: '/DashBoard',
    element: (
      <LoginProtecter>
        <AuthProvider>
            <DashBoard />
        </AuthProvider>
      </LoginProtecter>
    ),
    children: [
      { path: '', element: <Home /> },
      {
        path: 'Users',
        children: [
          { path: '', element: protectedRoute(<UserGet />, "User", "List") },
          { path: 'Create', element: protectedRoute(<UserCreate />, "User", "New") },
          { path: 'Edit', element: protectedRoute(<UserEdit />, "User", "Edit") }
        ]
      },
      {
        path: 'Merchant',
        children: [
          { path: '', element: protectedRoute(<SubMerchantGet />, "SubMerchant", "List") },
          { path: 'Setting', element: protectedRoute(<SubMerchantSetting />, "SubMerchant", "Settings") },
          { path: 'OverView', element: protectedRoute(<SubMerchantOverview />, "SubMerchant", "Overview") },
          { path: 'Create', element: protectedRoute(<SubMerchantCreate />, "SubMerchant", "New") },
          { path: 'Edit', element: protectedRoute(<SubMerchantEdit />, "SubMerchant", "Edit") }
        ]
      },
      {
        path: 'APIKey',
        children: [
          { path: '', element: protectedRoute(<APIKeyGet />, "APIKey", "List") },
          { path: 'Create', element: protectedRoute(<APIKeyCreate />, "APIKey", "New") }
        ]
      },
      {
        path: 'Transaction',
        children: [
          { path: '', element: protectedRoute(<TransactionGet />, "Transaction", "List") },
          { path: 'View', element: protectedRoute(<TransactionView />, "Transaction", "View") },
          { path: 'Link', element: protectedRoute(<PaymentLink />, "Transaction", "Link") },
          { path: 'Create', element: protectedRoute(<TransactionCreate />, "Transaction", "New") }
        ]
      }
    ]
  },
  {
    path: '/Login',
    element: <Login />
  },
  {
    path: '/PasswordResetForm',
    element: <PasswordResetForm />
  },
  {
    path: '/PasswordResetRequest',
    element: <PasswordResetRequest />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
