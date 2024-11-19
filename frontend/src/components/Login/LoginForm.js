import React, { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { loginAdapter } from '../../adapters/loginAdapter';
import Logo from '../../assets/logo.png';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const navigate = useNavigate();

    useEffect(() => {
        if (state.success) {
            navigate('/dashboard'); // Navegar al sidebar después del logueo exitoso
        }
        if (state.error) {
            toast.error(state.error);
        }
        if (state.emailError) {
            toast.warn(state.emailError);
        }
        if (state.passwordError) {
            toast.warn(state.passwordError);
        }
    }, [state.success, state.error, state.emailError, state.passwordError, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch({ type: 'SET_LOADING', value: true });
        dispatch({ type: 'SET_ERROR', message: '' });
        dispatch({ type: 'SET_SUCCESS', value: false });

        setTimeout(async () => {
            const result = await loginAdapter(state.email, state.password);
            if (result.success) {
                dispatch({ type: 'SET_SUCCESS', value: true });
                dispatch({ type: 'SET_LOADING', value: false });
                onLogin(state.email, state.password); // Manejado por `App.js`
            } else {
                dispatch({ type: 'SET_ERROR', message: result.message });
                dispatch({ type: 'SET_LOADING', value: false });
            }
        }, 1000); // Simula la demora
    };

    return (
        <section className="login-section">
            <ToastContainer />
            {state.loading ? (
                <div className="loading-container">
                    <img src={Logo} alt="Loading..." className="loading-logo" />
                </div>
            ) : (
                <div className="login-container">
                    <div className="login-logo-section">
                        <img
                            className="login-logo"
                            src={Logo}
                            alt="Company Logo"
                        />
                    </div>

                    <div className="login-form-section">
                        <form onSubmit={handleSubmit} className="login-form w-full max-w-md">
                            <div className="login-title-container">
                                <h2 className="login-title">¡Bienvenido, Digite Credenciales!</h2>
                            </div>

                            <div className="login-fields-container">
                                {/* Campo de Email */}
                                <div className="login-input-container">
                                    <div className="login-icon-container">
                                        <FaEnvelope className="icon" style={{ color: '#022852', fontSize: '1.5rem' }} />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Ej. corporativo@miroqui.es"
                                        value={state.email}
                                        onChange={(e) =>
                                            dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })
                                        }
                                        autoComplete="email"
                                        className="login-input-field"
                                    />
                                </div>

                                {/* Campo de Contraseña */}
                                <div className="login-input-container">
                                    <div className="login-icon-container">
                                        <FaLock className="icon" style={{ color: '#022852', fontSize: '1.5rem' }} />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Contraseña"
                                        value={state.password}
                                        onChange={(e) =>
                                            dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })
                                        }
                                        autoComplete="current-password"
                                        className="login-input-field"
                                    />
                                </div>

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
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default LoginForm;
