import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/ContentContext";
import ContentStyle from "../ContentStyle";
import { getSubMerchantSettingById, updateSubMerchantSetting } from "../../../api/SubMerchant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApplePayModal from "./ApplePayModal";
import GooglePayModal from "./GooglePayModal";
import DeletePop from "../Popup/DeletePop";

const SubMerchantSetting = () => {
  const { selectedMerchant } = useAuth();
  const [settings, setSettings] = useState({});
  const [showGooglePayModal, setShowGooglePayModal] = useState(false);
  const [showApplePayModal, setShowApplePayModal] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [settingKeyToToggle, setSettingKeyToToggle] = useState(null);
  const [subKeyToToggle, setSubKeyToToggle] = useState(null);
  const [googlePayMerchantId, setGooglePayMerchantId] = useState("");
  const [applePayDetails, setApplePayDetails] = useState({
    merchantId: "",
    processingCert: null,
    processingCertPassword: "",
    identityCert: null,
    identityCertPassword: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (selectedMerchant?.id) {
        try {
          const data = await getSubMerchantSettingById(selectedMerchant.id);
          setSettings(data);
        } catch (error) {
          console.error("Error fetching settings:", error);
        }
      }
    };
    fetchSettings();
  }, [selectedMerchant?.id]);

  const handleToggleChange = (settingKey, subKey) => {
    const updatedValue = !settings[settingKey]?.[subKey];
    if (!updatedValue) {
      // 如果是关闭开关，3D Secure（payerAuthenticationSettings）和 Settlement（settlementSettings）无需弹出确认
      if (
        settingKey === "payerAuthenticationSettings" ||
        settingKey === "settlementSettings"
      ) {
        // 直接更新设置
        updateSetting(settingKey, subKey, updatedValue);
      } else {
        // 对于 Google Pay 和 Apple Pay 在关闭时需要弹出确认框
        setSettingKeyToToggle(settingKey);
        setSubKeyToToggle(subKey);
        setShowDeletePopup(true);
      }
    } else {
      // 如果是开启开关，针对 Google Pay 和 Apple Pay 弹出相应的激活模态框
      if (settingKey === "googlePaySettings") {
        setShowGooglePayModal(true);
      } else if (settingKey === "applePaySettings") {
        setShowApplePayModal(true);
      } else {
        updateSetting(settingKey, subKey, updatedValue);
      }
    }
  };

  const updateSetting = async (settingKey, subKey, updatedValue) => {
    // 构造要更新的局部对象
    const partialUpdate = {
      [settingKey]: {
        [subKey]: updatedValue,
      },
    };

    // 先更新前端 state
    setSettings((prev) => ({
      ...prev,
      [settingKey]: {
        ...prev[settingKey],
        [subKey]: updatedValue,
      },
    }));

    try {
      // 将局部更新的数据传给后端
      await updateSubMerchantSetting(selectedMerchant.id, partialUpdate);
    } catch (error) {
      console.error("Error updating settings:", error);
      // 更新失败则回滚到之前的状态
      setSettings((prev) => ({
        ...prev,
        [settingKey]: {
          ...prev[settingKey],
          [subKey]: !updatedValue,
        },
      }));
    }
  };

  const handleDelete = () => {
    if (settingKeyToToggle && subKeyToToggle) {
      updateSetting(settingKeyToToggle, subKeyToToggle, false);
      setShowDeletePopup(false);
    }
  };

  const handleCancel = () => {
    setShowDeletePopup(false);
  };

  const handleGooglePayActivate = async () => {
    const partialUpdate = {
      googlePaySettings: {
        enable: true,
        merchantId: googlePayMerchantId,
      },
    };

    // 先乐观更新前端 state
    setSettings((prev) => ({
      ...prev,
      googlePaySettings: {
        ...prev.googlePaySettings,
        enable: true,
        merchantId: googlePayMerchantId,
      },
    }));

    console.log(settings);
    try {
      await updateSubMerchantSetting(selectedMerchant.id, partialUpdate);
      setShowGooglePayModal(false);
      toast.success("Google Pay activated successfully.");
    } catch (error) {
      console.error("Error activating Google Pay:", error);
      // 如果失败，可根据需求进行回滚或给出提示
      setSettings((prev) => ({
        ...prev,
        googlePaySettings: {
          ...prev.googlePaySettings,
          enable: false,
          merchantId: prev.googlePaySettings?.merchantId || "",
        },
      }));
    }
  };

  const handleApplePayActivate = async () => {
    const partialUpdate = {
      applePaySettings: {
        enable: true,
        merchantId: applePayDetails.merchantId,
        processingCertPassword: applePayDetails.processingCertPassword,
        identityCertPassword: applePayDetails.identityCertPassword,
      },
    };
  
    // 添加证书到 partialUpdate，如果它们存在
    if (applePayDetails.processingCert) {
      partialUpdate.applePaySettings.processingCert = applePayDetails.processingCert;
    }
  
    if (applePayDetails.identityCert) {
      partialUpdate.applePaySettings.identityCert = applePayDetails.identityCert;
    }
  
    // 乐观地更新前端 state
    setSettings((prev) => ({
      ...prev,
      applePaySettings: {
        ...prev.applePaySettings,
        enable: true,
        ...partialUpdate.applePaySettings,
      },
    }));
  
    try {
      console.log("Partial update data:", partialUpdate);
      await updateSubMerchantSetting(selectedMerchant.id, partialUpdate);
      setShowApplePayModal(false);
      toast.success("Apple Pay activated successfully.");
    } catch (error) {
      console.error("Error activating Apple Pay:", error);
      // 回滚状态
      setSettings((prev) => ({
        ...prev,
        applePaySettings: {
          ...prev.applePaySettings,
          enable: false,
          merchantId: prev.applePaySettings?.merchantId || "",
        },
      }));
    }
  };
  
  

  return (
    <ContentStyle>
      <div className="h-full bg-white rounded-3xl pb-44 p-6 phone:overflow-x-auto tabletSmall:overflow-x-auto overflow-x-auto box-content">
        <h1 className="text-3xl font-bold mb-6">Merchant Settings</h1>

        {/* 3D Secure */}
        <div className="bg-white p-6 rounded-lg mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">3D Secure</h2>
          <p className="mb-2 flex items-center justify-between">
            If enabled, the merchant can process payments using 3D Secure (Payer Authentication). A 3DS fee is applied to transactions where this feature is used.
            <button
              type="button"
              className={`ml-4 w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                settings?.payerAuthenticationSettings?.enable ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => handleToggleChange("payerAuthenticationSettings", "enable")}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  settings?.payerAuthenticationSettings?.enable ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </p>
        </div>

        {/* Settlement */}
        <div className="bg-white p-6 rounded-lg mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Settlement</h2>
          {/* Generate Settlement Document */}
          <div className="flex items-center justify-between mb-4">
            <span className="mr-2">Generate Settlement Document</span>
            <button
              type="button"
              disabled
              className={`ml-auto w-12 h-6 flex items-center rounded-full p-1 cursor-not-allowed transition-colors duration-200 ${
                settings?.settlementSettings?.generateDocument ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  settings?.settlementSettings?.generateDocument ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>

          {/* Send Settlement to Email */}
          <div className="flex items-center justify-between mb-4">
            <span className="mr-2">Send Settlement to Email</span>
            <button
              type="button"
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                settings?.settlementSettings?.sendEmail ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => handleToggleChange("settlementSettings", "sendEmail")}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  settings?.settlementSettings?.sendEmail ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>

          {settings?.settlementSettings?.merchantEmail && (
            <p className="ml-6 text-gray-600">
              Email: <span className="font-semibold">{settings.settlementSettings.merchantEmail}</span>
            </p>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>

          {/* Google Pay */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Google Pay</h3>
            <div className="flex items-center mb-2 justify-between">
              <span className="mr-2">Enable Google Pay</span>
              <button
                type="button"
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                  settings?.googlePaySettings?.enable ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => handleToggleChange("googlePaySettings", "enable")}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    settings?.googlePaySettings?.enable ? "translate-x-6" : ""
                  }`}
                ></div>
              </button>
            </div>
            {!settings?.googlePaySettings?.enable && (
              <p className="text-gray-600">
                A faster, safer way to pay. Google Pay™ allows your customers to securely and quickly check out in apps and on the web.
              </p>
            )}
            {settings?.googlePaySettings?.enable && (
              <p className="text-gray-600">Merchant ID: {settings.googlePaySettings?.merchantId}</p>
            )}
            <a
              href="https://pay.google.com/about/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Documentation
            </a>
          </div>

          {/* Apple Pay */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Apple Pay</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="mr-2">Enable Apple Pay</span>
              <button
                type="button"
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                  settings?.applePaySettings?.enable ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => handleToggleChange("applePaySettings", "enable")}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    settings?.applePaySettings?.enable ? "translate-x-6" : ""
                  }`}
                ></div>
              </button>
            </div>
            {!settings?.applePaySettings?.enable && (
              <p className="text-gray-600">
                A faster, safer way to pay. Apple Pay™ allows your customers to securely and quickly check out in apps and on the web.
              </p>
            )}
            {settings?.applePaySettings?.enable && (
              <>
                <p className="text-gray-600">
                  Merchant ID: {settings.applePaySettings?.merchantId}
                </p>
                <p className="text-gray-600">
                  Certificate Expiry: {settings.applePaySettings?.processingCertExpirydate}
                  <span
                    className={`ml-2 ${
                      new Date(settings.applePaySettings.processingCertExpirydate) < new Date()
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }`}
                  >
                    {new Date(settings.applePaySettings.processingCertExpirydate) < new Date()
                      ? "Expired"
                      : "Active"}
                  </span>
                </p>
              </>
            )}
            <a
              href="https://www.apple.com/au/apple-pay/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Documentation
            </a>
          </div>
        </div>

        {/* Google Pay Modal */}
        {showGooglePayModal && (
          <GooglePayModal
            isOpen={showGooglePayModal}
            onClose={() => setShowGooglePayModal(false)}
            onActivate={handleGooglePayActivate}
            merchantId={googlePayMerchantId}
            setGooglePayMerchantId={setGooglePayMerchantId}
          />
        )}

        {/* Apple Pay Modal */}
        {showApplePayModal && (
          <ApplePayModal
            isOpen={showApplePayModal}
            onClose={() => setShowApplePayModal(false)}
            onActivate={handleApplePayActivate}
            applePayDetails={applePayDetails}
            setApplePayDetails={setApplePayDetails}
          />
        )}

        {/* Delete Popup */}
        {showDeletePopup && (
          <DeletePop
            handleDelete={handleDelete}
            handleCancel={handleCancel}
             title="Disable confirmation"
            message="Are you sure you want to disable this setting"
          />
        )}
      </div>
    </ContentStyle>
  );
};

export default SubMerchantSetting;
