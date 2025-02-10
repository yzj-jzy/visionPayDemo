import { formatMeridiem } from '@mui/x-date-pickers/internals';
import apiClient from './apiClient';

export const getSubMerchantOverviewById = async (id) => {
  try {
    const response = await apiClient.get(`/api/submerchant/${id}/overview`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubMerchantSetting = async (id, settings) => {
  try {
    console.log("Partial settings to update:", settings);

    const formData = new FormData();

    // Payer Authentication Settings
    if (settings.payerAuthenticationSettings?.enable !== undefined) {
      formData.append(
        'PayerAuthenticationSettings.Enable',
        settings.payerAuthenticationSettings.enable
      );
    }

    // Settlement Settings
    if (settings.settlementSettings !== undefined) {
      // Settlement Settings - Generate Document
      if (settings.settlementSettings?.generateDocument !== undefined) {
        formData.append(
          'SettlementSettings.GenerateDocument',
          settings.settlementSettings.generateDocument
        );
      }

      // Settlement Settings - Send to Email
      if (settings.settlementSettings?.sendEmail !== undefined) {
        formData.append('SettlementSettings.SendEmail', settings.settlementSettings.sendEmail);
      }

      // Settlement Settings - Merchant Email
      if (settings.settlementSettings?.merchantEmail !== undefined) {
        formData.append('SettlementSettings.MerchantEmail', settings.settlementSettings.merchantEmail);
      }
    }

    // Google Pay Settings
    if (settings.googlePaySettings !== undefined) {
      if (settings.googlePaySettings?.enable !== undefined) {
        formData.append('GooglePaySettings.Enable', settings.googlePaySettings.enable);
      }
      if (settings.googlePaySettings?.merchantId !== undefined) {
        formData.append('GooglePaySettings.MerchantId', settings.googlePaySettings.merchantId);
      }
    }

    // Apple Pay Settings
      if (settings.applePaySettings !== undefined) {
        if (settings.applePaySettings?.enable !== undefined) {
          formData.append('ApplePaySettings.Enable', settings.applePaySettings.enable);
        }
        if (settings.applePaySettings?.merchantId !== undefined) {
          formData.append('ApplePaySettings.MerchantId', settings.applePaySettings.merchantId);
        }
        if (settings.applePaySettings?.processingCert !== undefined) {
          formData.append('ApplePaySettings.ProcessingCert', settings.applePaySettings.processingCert);
        }
        // 修改 merchantIdentityCert 为 identityCert
        if (settings.applePaySettings?.identityCert !== undefined) {
          formData.append('ApplePaySettings.IdentityCert', settings.applePaySettings.identityCert);
        }
        if (settings.applePaySettings?.processingCertPassword !== undefined) {
          formData.append('ApplePaySettings.ProcessingCertPassword', settings.applePaySettings.processingCertPassword);
        }
        // 修改 merchantIdentityCertPassword 为 identityCertPassword
        if (settings.applePaySettings?.identityCertPassword !== undefined) {
          formData.append('ApplePaySettings.IdentityCertPassword', settings.applePaySettings.identityCertPassword);
        }
        if (settings.applePaySettings?.processingCertExpirydate !== undefined) {
          formData.append('ApplePaySettings.ProcessingCertExpiryDate', settings.applePaySettings.processingCertExpirydate);
        }
        if (settings.applePaySettings?.merchantIdentityCertExpiryDate !== undefined) {
          formData.append('ApplePaySettings.MerchantIdentityCertExpiryDate', settings.applePaySettings.merchantIdentityCertExpiryDate);
        }
      }


    console.log("FormData entries:", [...formData.entries()]);

    const response = await apiClient.put(`/api/submerchant/${id}/settings`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in updateSubMerchantSetting:", error);
    throw error;
  }
};


export const getSubMerchantById = async (id) => {
  try {
    const response = await apiClient.get(`/api/submerchant/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSubMerchantSettingById = async (id) => {
  try {
    const response = await apiClient.get(`/api/submerchant/${id}/settings`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSubMerchant = async (offset, limit) => {
  try {
    const response = await apiClient.post(`/api/submerchant/filter`, { offset, limit });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSubMerchant = async (merchantData) => {
  try {
    const response = await apiClient.post(`/api/submerchant`, merchantData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editSubMerchant = async (id,merchantData) => {
  try {
    const response = await apiClient.put(`/api/submerchant/${id}`, merchantData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSubMerchant = async (id) => {
  try {
    const response = await apiClient.delete(`/api/submerchant/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
