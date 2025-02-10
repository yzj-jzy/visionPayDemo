import apiClient from './apiClient';
const API_URL = import.meta.env.VITE_API_URL;

export const getUser = async (offset, limit) => {
  try {
    const response = await apiClient.post('/api/user/filter', { offset, limit });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/api/user/${id}`);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userName, role, subMerchants ) => {
  const emailConfirmationUrl = `${API_URL}/PasswordResetForm?email=${userName}`;
  try {
    const response = await apiClient.post('/api/user', { userName, role, emailConfirmationUrl, subMerchants });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EditUser = async (id,role, subMerchants) => {
  try {
    const response = await apiClient.put(`/api/user/${id}`,{role, subMerchants});
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/api/user/${userId}`);
    
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
