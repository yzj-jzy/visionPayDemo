import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const InputBox = ({ fieldName, isRequired, placeholder, value, onChange, type = "text" }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false); 

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setIsTouched(true); 
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleChange = (inputValue) => {
        onChange(inputValue); 
        setIsTouched(true);   
    };

    return (
        <div className="mb-4 w-full mx-auto relative">
            <label className="block text-login-text text-gray-700 text-sm mb-2 w-36">
                {fieldName}
                {isRequired && <span className="ml-0.5 text-login-text"> *</span>}
            </label>
            <input
                type={type === "password" && passwordVisible ? "text" : type}
                placeholder={placeholder}
                className={`appearance-none py-3 pl-4 text-login-text border ${
                    isFocused ? 'border-blue-500' : 'border-gray-300'
                } rounded w-full leading-tight focus:outline-none focus:shadow-outline`}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={value}
                onChange={(e) => handleChange(e.target.value)} 
            />
            {type === "password" && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-12 transform -translate-y-1/2 text-gray-500"
                >
                    {passwordVisible ? (
                        <AiOutlineEye size={24} />
                    ) : (
                        <AiOutlineEyeInvisible size={24} />
                    )}
                </button>
            )}
            {isTouched && value === '' && (
                <p className="text-red-500 text-xs mt-2">
                    {fieldName} is required.
                </p>
            )}
        </div>
    );
};

export default InputBox;
