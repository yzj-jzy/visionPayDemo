import { redirect } from 'react-router-dom';
import apiClient from './apiClient';
const API_URL = import.meta.env.VITE_API_URL;

export const getTransaction = async (subMerchantId, search, refundsOnly,startDate, endDate, offset, limit) => {
  try {
    // console.log(subMerchantId, search, refundsOnly,startDate, endDate, offset, limit);
    const response = await apiClient.post('/api/payment/filter', { subMerchantId, search, refundsOnly ,startDate, endDate, offset, limit });
    // console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactionById = async (reference, subMerchantId) => {
  try {
    const response = await apiClient.get(`/api/payment/${subMerchantId}/${reference}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const RefundTransaction = async (reference, subMerchantId,amount) => {
  try {
    const response = await apiClient.put(`/api/payment/${subMerchantId}/${reference}/refund`,{amount});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPaymentLink = async (reference, subMerchantId,amount) => {
  try {
    const response = await apiClient.get(`/api/payment/${subMerchantId}/${reference}/${amount}/createlink`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const authorizePayment = async (subMerchantId,reference, cardHolder, cardNumber, cardExpiry, amount, customerIP, currency, capture, cvv) => {
  try {
    const response = await apiClient.post(`/api/payment/${subMerchantId}/authorize`,{reference, cardHolder, cardNumber, cardExpiry, amount, customerIP, currency, capture, cvv});
    return response.data;
  } catch (error) {
    throw error;
  }
};


