import apiClient from './apiClient';
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (username, password) => {
  try {
    const response = await apiClient.post(`/api/auth/login`, { username, password });
    if (response.data.token) {
      const { id, token, expiryDate } = response.data;
      localStorage.setItem('userId', id);
      // localStorage.setItem('token', token);
      // localStorage.setItem('expiryDate', expiryDate);
      document.cookie = `token=${token}; path=/;`;
      document.cookie = `expiryDate=${expiryDate}; path=/;`;

    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserDetail = async () => {
  try {
    const response = await apiClient.get(`/api/user/login`, {});
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const extendSession = async () => {
  try {
    const response = await apiClient.get(`api/auth/extend-session`, {});
    if (response.data.token) {
      const { id, token, expiryDate } = response.data;
      localStorage.setItem('userId', id);
      // localStorage.setItem('token', token);
      // localStorage.setItem('expiryDate', expiryDate);
      document.cookie = `token=${token}; path=/;`;
      document.cookie = `expiryDate=${expiryDate}; path=/;`;

    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const passwordResetRequest = async (email) => {
  try {
    const forgotPasswordUrl = `${API_URL}/PasswordResetForm`;

    const response = await apiClient.post(`/api/auth/reset-password-request`, {
      email,
      forgotPasswordUrl,
    });


    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const passwordRequest = async () => {
  try {
    const response = await apiClient.post(`/api/auth/password-request`);


    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const passwordReset = async (email, passToken, newPassword) => {
  try {
    const id = localStorage.getItem('userId');

    const response = await apiClient.post(`/api/auth/reset-password`, {
      id,
      email,
      passToken,
      newPassword
    });


    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
