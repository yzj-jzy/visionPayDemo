import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { editSubMerchant, getSubMerchantById } from '../../../api/SubMerchant';
import ContentStyle from '../ContentStyle';

const SubMerchantEdit = () => {
  const [formData, setFormData] = useState({
    merchantCode: '',
    name: '',
    abn: '',
    address: '',
    city: '',
    countryCode: '',
    postalCode: '',
    phone: '',
    email: '',
    state: '',
    processingFeeRate: '',
    processingFeeType: 'PERCENTAGE',
    gatewayFeeRate: 0.25,
    gatewayFeeType: 'FLAT',
    payerAuthenticationFeeRate: 0.20,
    payerAuthenticationFeeType: 'FLAT',
    decisionManagerFeeRate: 0.10,
    decisionManagerFeeType: 'FLAT',
    bankName: '',
    accountName: '',
    bsbNumber: '',
    accountNumber: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const merchantId = new URLSearchParams(location.search).get('merchantId');

  const inputRefs = useRef({});

  useEffect(() => {
    const fetchMerchantData = async () => {
      try {
        if (merchantId) {
          const merchant = await getSubMerchantById(merchantId);
          if (merchant) {
            setFormData({
              merchantCode: merchant.merchantCode || '',
              name: merchant.name || '',
              abn: merchant.abn || '',
              address: merchant.address || '',
              city: merchant.city || '',
              countryCode: merchant.countryCode || '',
              postalCode: merchant.postalCode || '',
              phone: merchant.phone || '',
              email: merchant.email || '',
              state: merchant.state || '',
              processingFeeRate: merchant.processingFee.rate || '',
              processingFeeType: merchant.processingFee.feeType || 'PERCENTAGE',
              gatewayFeeRate: merchant.gatewayFee?.rate || 0.25,
              gatewayFeeType: merchant.gatewayFee?.feeType || 'FLAT',
              payerAuthenticationFeeRate: merchant.payerAuthenticationFee?.rate || 0.20,
              payerAuthenticationFeeType: merchant.payerAuthenticationFee?.feeType || 'FLAT',
              decisionManagerFeeRate: merchant.decisionManagerFee?.rate || 0.10,
              decisionManagerFeeType: merchant.decisionManagerFee?.feeType || 'FLAT',
              bankName: merchant.bankAccount.bankName || '',
              accountName: merchant.bankAccount.accountName || '',
              bsbNumber: merchant.bankAccount.bsbNumber || '',
              accountNumber: merchant.bankAccount.accountNumber || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching merchant data:', error);
      }
    };

    fetchMerchantData();
  }, [merchantId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.merchantCode || !/^[0-9]{1,20}$/.test(formData.merchantCode)) {
      newErrors.merchantCode = 'Merchant Code must be numeric and max 20 digits.';
    }
    if (!formData.name || formData.name.length > 21 || !/^[a-zA-Z\s]*$/.test(formData.name)) {
      newErrors.name = 'Name is required, must be less than 21 characters, and only contain letters and spaces.';
    }
    if (!formData.abn || formData.abn.length !== 11 || isNaN(formData.abn)) {
      newErrors.abn = 'ABN must be exactly 11 numeric characters.';
    }
    if (!formData.address || formData.address.length > 250) {
      newErrors.address = 'Address is required and must be less than 250 characters.';
    }
    if (!formData.city || formData.city.length > 250 || !/^[a-zA-Z\s]*$/.test(formData.city)) {
      newErrors.city = 'City is required, must be less than 250 characters, and only contain letters and spaces.';
    }
    if (!formData.countryCode || formData.countryCode.length !== 2 || !/^[A-Za-z]*$/.test(formData.countryCode)) {
      newErrors.countryCode = 'Country Code must be exactly 2 letters (ISO 3166-1 alpha-2).';
    }
    if (!formData.postalCode || formData.postalCode.length > 10) {
      newErrors.postalCode = 'Postal Code must be less than 10 characters.';
    }
    if (!formData.phone || formData.phone.length > 20) {
      newErrors.phone = 'Phone must be less than 20 characters.';
    }
    if (!formData.email || formData.email.length > 40) {
      newErrors.email = 'Email must be less than 40 characters.';
    }
    if (!formData.state || formData.state.length > 250 || !/^[a-zA-Z\s]*$/.test(formData.state)) {
      newErrors.state = 'State must be less than 250 characters and only contain letters and spaces.';
    }
    if (!formData.processingFeeRate || isNaN(formData.processingFeeRate)) {
      newErrors.processingFeeRate = 'Processing fee rate must be a decimal.';
    }
    if (!formData.gatewayFeeRate || isNaN(formData.gatewayFeeRate)) {
      newErrors.gatewayFeeRate = 'Gateway fee rate must be a decimal.';
    }
    if (!formData.payerAuthenticationFeeRate || isNaN(formData.payerAuthenticationFeeRate)) {
      newErrors.payerAuthenticationFeeRate = '3DS2 fee rate must be a decimal.';
    }
    if (!formData.decisionManagerFeeRate || isNaN(formData.decisionManagerFeeRate)) {
      newErrors.decisionManagerFeeRate = 'Decision Manager fee rate must be a decimal.';
    }
    if (!formData.bankName || formData.bankName.length > 255 || !/^[a-zA-Z\s]*$/.test(formData.bankName)) {
      newErrors.bankName = 'Bank Name must be less than 255 characters and only contain letters and spaces.';
    }
    if (!formData.accountName || formData.accountName.length > 255 || !/^[a-zA-Z\s]*$/.test(formData.accountName)) {
      newErrors.accountName = 'Account Name must be less than 255 characters and only contain letters and spaces.';
    }
    if (!formData.bsbNumber || formData.bsbNumber.length !== 6 || isNaN(formData.bsbNumber)) {
      newErrors.bsbNumber = 'BSB Number must be exactly 6 numeric characters.';
    }
    if (!formData.accountNumber || formData.accountNumber.length > 10 || isNaN(formData.accountNumber)) {
      newErrors.accountNumber = 'Account Number must be numeric and max 10 digits.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ['abn', 'merchantCode', 'bsbNumber', 'accountNumber'];
    if (numericFields.includes(name)) {
      if (/^\d*$/.test(value)) {
        if (name === 'abn' && value.length > 11) return;
        if (name === 'bsbNumber' && value.length > 6) return;
        if (name === 'accountNumber' && value.length > 10) return;
        if (name === 'merchantCode' && value.length > 20) return;
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      const stringFields = ['name', 'city', 'state', 'countryCode', 'bankName', 'accountName'];
      const maxLengths = {
        name: 21,
        address: 250,
        city: 250,
        state: 250,
        countryCode: 2,
        postalCode: 10,
        phone: 20,
        email: 40,
        bankName: 255,
        accountName: 255,
      };

      if (stringFields.includes(name) && !/^[a-zA-Z\s]*$/.test(value)) {
        return; 
      }
      if (maxLengths[name] && value.length > maxLengths[name]) return;

      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      if (inputRefs.current[firstErrorField]) {
        inputRefs.current[firstErrorField].scrollIntoView({ behavior: 'smooth' });
        inputRefs.current[firstErrorField].focus();
      }
    } else {
      try {
        const formattedData = {
          merchantCode: formData.merchantCode,
          name: formData.name,
          abn: formData.abn,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          countryCode: formData.countryCode,
          postalCode: formData.postalCode,
          phone: formData.phone,
          email: formData.email,
          processingFee: {
            rate: parseFloat(formData.processingFeeRate),
            feeType: formData.processingFeeType,
          },
          gatewayFee: {
            rate: parseFloat(formData.gatewayFeeRate),
            feeType: formData.gatewayFeeType,
          },
          payerAuthenticationFee: {
            rate: parseFloat(formData.payerAuthenticationFeeRate),
            feeType: formData.payerAuthenticationFeeType,
          },
          decisionManagerFee: {
            rate: parseFloat(formData.decisionManagerFeeRate),
            feeType: formData.decisionManagerFeeType,
          },
          bankAccount: {
            bankName: formData.bankName,
            accountName: formData.accountName,
            bsbNumber: formData.bsbNumber,
            accountNumber: formData.accountNumber,
          },
        };
        await editSubMerchant(merchantId, formattedData);
        navigate("/dashboard/Merchant");
      } catch (error) {
        console.error("Error edit merchant:", error);
      }
    }
  };

  return (
    <ContentStyle>
      <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl  p-8 shadow-lg phone:overflow-x-auto tabletSmall:overflow-x-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Merchant</h1>
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Company Details Card */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-4">Company Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {['merchantCode', 'name', 'abn', 'address', 'city', 'state', 'countryCode', 'postalCode', 'phone', 'email'].map((field) => (
                <div key={field} className="relative">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')} <label className='text-red-500'>*</label>
                  </label>
                  <input
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.replace(/([A-Z])/g, ' $1')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    ref={(el) => (inputRefs.current[field] = el)}
                  />
                  {errors[field] && (
                    <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fees Card */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-4">Fees</h2>
            {[
              {
                title: 'Processing Fee',
                rateField: 'processingFeeRate',
                typeField: 'processingFeeType',
                defaultRate: 0.0150,
                defaultType: 'PERCENTAGE'
              },
              {
                title: 'Gateway Fee',
                rateField: 'gatewayFeeRate',
                typeField: 'gatewayFeeType',
                defaultRate: 0.25,
                defaultType: 'FLAT'
              },
              {
                title: '3DS2 Fee',
                rateField: 'payerAuthenticationFeeRate',
                typeField: 'payerAuthenticationFeeType',
                defaultRate: 0.20,
                defaultType: 'FLAT'
              },
              {
                title: 'Decision Manager Fee',
                rateField: 'decisionManagerFeeRate',
                typeField: 'decisionManagerFeeType',
                defaultRate: 0.10,
                defaultType: 'FLAT'
              }
            ].map(({ title, rateField, typeField }) => (
              <div key={title} className="mb-4">
                <h3 className="text-lg font-medium mb-2">{title}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="relative">
                    <label htmlFor={rateField} className="block text-sm font-medium text-gray-700 mb-1">Rate <label className='text-red-500'> * </label> </label>
                    <input
                      id={rateField}
                      name={rateField}
                      value={formData[rateField]}
                      onChange={handleChange}
                      placeholder="Rate"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                      type="number"
                      step="0.01"
                      ref={(el) => (inputRefs.current[rateField] = el)}
                    />
                    {errors[rateField] && (
                      <p className="text-red-600 text-sm mt-1">{errors[rateField]}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label htmlFor={typeField} className="block text-sm font-medium text-gray-700 mb-1">Fee Type <label className='text-red-500'>*</label> </label>
                    <select
                      id={typeField}
                      name={typeField}
                      value={formData[typeField]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                      ref={(el) => (inputRefs.current[typeField] = el)}
                    >
                      <option value="PERCENTAGE">PERCENTAGE</option>
                      <option value="FLAT">FLAT</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bank Details Card */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-4">Bank Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {['bankName', 'accountName', 'bsbNumber', 'accountNumber'].map((field) => (
                <div key={field} className="relative">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')} <label className='text-red-500'>*</label>
                  </label>
                  <input
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.replace(/([A-Z])/g, ' $1')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    ref={(el) => (inputRefs.current[field] = el)}
                  />
                  {errors[field] && (
                    <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all">
            Save
          </button>
        </form>
      </div>
    </ContentStyle>
  );
};

export default SubMerchantEdit;
