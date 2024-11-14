// InputField.js
import React from 'react';

const InputField = ({ id, type, placeholder, iconClass, value, onChange }) => (
    <div className="login-input-container">
        <div className="login-icon-container">
            <i className={iconClass}></i>
        </div>
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="login-input-field"
            required
        />
    </div>
);

export default InputField;
