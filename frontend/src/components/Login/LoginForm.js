import React, { useReducer, useEffect } from 'react';
import './LoginForm.css';
import { loginAdapter } from '../../adapters/loginAdapter';
import Logo from '../../assets/logo.png';
import InputField from '../InputField';

const initialState = {
    email: '',
    password: '',
    loading: false,
    error: '',
    success: false,
    emailError: '',
    passwordError: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_LOADING':
            return { ...state, loading: action.value };
        case 'SET_ERROR':
            return { ...state, error: action.message };
        case 'SET_SUCCESS':
            return { ...state, success: action.value };
        case 'SET_EMAIL_ERROR':
            return { ...state, emailError: action.message };
        case 'SET_PASSWORD_ERROR':
            return { ...state, passwordError: action.message };
        default:
            return state;
    }
}

const LoginForm = ({ onLogin }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'SET_LOADING', value: true });
        dispatch({ type: 'SET_ERROR', message: '' });
        dispatch({ type: 'SET_SUCCESS', value: false });
        dispatch({ type: 'SET_EMAIL_ERROR', message: '' });
        dispatch({ type: 'SET_PASSWORD_ERROR', message: '' });
    
        const result = await loginAdapter(state.email, state.password);
        if (result.success) {
            dispatch({ type: 'SET_SUCCESS', value: true });
            dispatch({ type: 'SET_FIELD', field: 'email', value: '' });
            dispatch({ type: 'SET_FIELD', field: 'password', value: '' });
            onLogin(state.email, state.password);
        } else {
            if (result.message.includes('formato')) {
                dispatch({ type: 'SET_EMAIL_ERROR', message: result.message });
            } else if (result.message.includes('Credenciales')) {
                dispatch({ type: 'SET_PASSWORD_ERROR', message: result.message });
            } else {
                dispatch({ type: 'SET_ERROR', message: result.message });
            }
        }
        dispatch({ type: 'SET_LOADING', value: false });
    };

    useEffect(() => {
        if (state.success || state.error) {
            const timer = setTimeout(() => {
                dispatch({ type: 'SET_SUCCESS', value: false });
                dispatch({ type: 'SET_ERROR', message: '' });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [state.success, state.error]);

    return (
        <section className="login-section">
            <div className="login-container">
                <div className="login-logo-section">
                    <img className="login-logo" src={Logo} alt="Company Logo" />
                </div>

                <div className="login-form-section">
                    <form onSubmit={handleSubmit} className="login-form w-full max-w-md">

                        <div className="login-title-container">
                            <h2 className="login-title">¡Bienvenido, Digite Credenciales!</h2>
                        </div>

                        <div className="login-fields-container">
                            {/* Campo de Email */}
                            <InputField
                                id="email"
                                type="email"
                                placeholder="Ej. corporativo@miroqui.es"
                                iconClass="fas fa-envelope text-gray-500"
                                value={state.email}
                                onChange={(e) =>
                                    dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })
                                }
                                error={state.emailError}
                                autoComplete="email" // Agregamos el atributo autocomplete
                            />

                            {/* Campo de Contraseña */}
                            <InputField
                                id="password"
                                type="password"
                                placeholder="Contraseña"
                                iconClass="fas fa-lock text-gray-500"
                                value={state.password}
                                onChange={(e) =>
                                    dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })
                                }
                                error={state.passwordError}
  autocomplete="current-password" 
                            />

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className={`login-button ${state.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={state.loading}
                                >
                                    {state.loading ? 'Loading...' : 'Ingresar'}
                                </button>
                            </div>
                        </div>

                        {state.error && (
                            <div className="login-error-message mt-4">{state.error}</div>
                        )}
                        {state.success && (
                            <p className="login-success-message">Login successful!</p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;
