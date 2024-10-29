// src/components/Login/LoginForm.js
import React, { useState } from 'react';
import './LoginForm.css';
import { loginAdapter } from '../../adapters/loginAdapter'; 
import Logo from '../../assets/logo.png'; 

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setError(''); 
        setSuccess(false);
        setEmailError('');
        setPasswordError('');

        const result = await loginAdapter(email, password); // API call to validate login
        if (result.success) {
            setSuccess(true);
            setEmail('');
            setPassword('');
            onLogin(); // Trigger successful login callback
        } else {
            // Set specific error messages depending on the response
            if (result.message.includes('format')) {
                setEmailError(result.message);
            } else if (result.message.includes('Credentials')) {
                setPasswordError(result.message);
            } else {
                setError(result.message);
            }
        }

        setLoading(false);
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-left">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <label htmlFor="email">Correo:</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope input-icon"></i>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="e.g. user@miroqui.es"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`input-field ${emailError ? 'error' : ''}`}
                                    required
                                />
                            </div>
                            {emailError && (
                                <div className="email-error-message">{emailError}</div>
                            )}
                        </div>
                        <div className="input-container">
                            <label htmlFor="password">Contraseña:</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`input-field ${passwordError ? 'error' : ''}`}
                                    required
                                />
                            </div>
                            {passwordError && (
                                <div className="error-message">{passwordError}</div>
                            )}
                        </div>
                        <button type="submit" className={`login-button ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? 'Loading...' : 'Log In'}
                        </button>

                        {error && (
                            <div id="error-message">{error}</div>
                        )}
                        {success && (
                            <p className="success-message">Login successful!</p>
                        )}
                    </form>
                </div>
                <div className="login-right">
                    <img src={Logo} alt="Company Logo" className="logo" />
                </div>
            </div>
        </div>
    );
};

export default LoginForm;