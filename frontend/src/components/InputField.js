// InputField.js
import React from 'react';

const InputField = ({ id, type, placeholder, iconClass, value, onChange, error }) => (
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
        {error && <div className="login-error-message">{error}</div>}
    </div>
);

export default InputField;
