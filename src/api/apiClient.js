import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
const SERVE_ADDRESS = import.meta.env.SERVER_ADDRESS;

const apiClient = axios.create({
  // baseURL: 'https://apigatewaystaging.visionpay.com.au',
  baseURL: 'http://localhost:3000/',
  // baseURL: 'https://apigateway.visionpay.com.au',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getCookie(name) {

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response;
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    console.log(error);
    if (error.response) {
      if (error.response.status === 401) {
        toast.error('Unauthorized, please log in again.');
        // Use navigate to redirect to login page
        const navigate = useNavigate();
        navigate('/Login');
      } else {
        const errorMessage = error.response.data?.message || 'Unexpected error occurred';
        toast.error(errorMessage);
        console.error('Request failed:', error.response.data);
      }
    } else {
      toast.error('Network or unexpected error occurred');
      console.error('Network or unexpected error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
