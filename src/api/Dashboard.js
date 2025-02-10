import apiClient from './apiClient';
const API_URL = import.meta.env.VITE_API_URL;

export const grossTransactionsData = async (subMerchantId,startDate,endDate) => {
    try {
      const response = await apiClient.post(`/api/dashboard/grosstransactions`,{subMerchantId, startDate, endDate});
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const successfulTransactionsData = async (subMerchantId,startDate,endDate) => {
  try {
    const response = await apiClient.post(`/api/dashboard/successfultransactions`,{subMerchantId, startDate, endDate});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const paymentMethodData = async (subMerchantId,startDate,endDate) => {
  try {
    const response = await apiClient.post(`/api/dashboard/paymentmethods`,{subMerchantId, startDate, endDate});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ThreeDsCompletionData = async (subMerchantId,startDate,endDate) => {
  try {
    const response = await apiClient.post(`/api/dashboard/3dscompletion`,{subMerchantId, startDate, endDate});
    return response.data;
  } catch (error) {
    throw error;
  }
};