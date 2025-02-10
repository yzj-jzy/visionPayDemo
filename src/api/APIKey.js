import apiClient from './apiClient';
const API_URL = import.meta.env.VITE_API_URL;

export const getAPIKey = async (offset, limit) => {
    try {
      const response = await apiClient.post(`/api/APIKey/filter`, { offset, limit });
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const getAPIKeyById = async (id) => {
  try {
    const response = await apiClient.get(`/api/APIKey/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAPIKey = async (name, description, subMerchantId) => {
  try {
      const response = await apiClient.post(`/api/APIKey`,{name, description, subMerchantId});
      return response.data;
  } catch (error) {
      throw error;
  }
  };

export const activeAPIKey = async (id,active) => {
  try {
      const response = await apiClient.put(`/api/APIKey/${id}/active/${active}`);
      return response.data;
  } catch (error) {
      throw error;
  }
  };


export const deleteAPIKey = async (id) => {
try {
    const response = await apiClient.delete(`/api/APIKey/${id}`);
    return response.data;
} catch (error) {
    throw error;
}
};

export const renewAccessToken = async (APIKeyId) => {
  try {
      const response = await apiClient.put(`/api/apikey/${APIKeyId}/accesstoken`);
      return response.data;
  } catch (error) {
      throw error;
  }
  };