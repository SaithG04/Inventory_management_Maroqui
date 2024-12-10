import React, { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import Logo from '../../assets/logo.png';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Estado inicial del formulario
const initialState = {
    email: '',
    password: '',
    error: '',
    success: false,
    emailError: '',
    passwordError: '',
    isLoading: false,
};

// Función reductora para actualizar el estado
function reducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_ERROR':
            return { ...state, error: action.message };
        case 'SET_SUCCESS':
            return { ...state, success: action.value };
        case 'SET_EMAIL_ERROR':
            return { ...state, emailError: action.message };
        case 'SET_PASSWORD_ERROR':
            return { ...state, passwordError: action.message };
        case 'SET_LOADING':
            return { ...state, isLoading: action.value };
        default:
            return state;
    }
}

const LoginForm = ({ onLogin }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();

    // useEffect para mostrar notificaciones y redirigir después de un inicio de sesión exitoso
    useEffect(() => {
        if (state.success) {
            dispatch({ type: 'SET_ERROR', message: '' }); // Limpia los errores
            dispatch({ type: 'SET_EMAIL_ERROR', message: '' });
            dispatch({ type: 'SET_PASSWORD_ERROR', message: '' });
            toast.success('Inicio de sesión exitoso');
            navigate('/dashboard');
        }
        if (state.error) {
            toast.dismiss(); // Cierra notificaciones previas
            toast.error(state.error);
        }
        if (state.emailError) {
            toast.dismiss(); // Cierra notificaciones previas
            toast.warn(state.emailError);
        }
        if (state.passwordError) {
            toast.dismiss(); // Cierra notificaciones previas
            toast.warn(state.passwordError);
        }
    }, [state.success, state.error, state.emailError, state.passwordError, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!state.email || !state.password) {
            toast.dismiss();
            toast.warn('Por favor, complete todos los campos.');
            return;
        }

        dispatch({ type: 'SET_LOADING', value: true });

        try {
            const response = await onLogin(state.email, state.password);

            // Valida la estructura de la respuesta
            if (response.success && response.token) {
                dispatch({ type: 'SET_SUCCESS', value: true });
            } else {
                throw new Error(response.message || 'Credenciales inválidas.');
            }
        } catch (error) {
            console.log('Detalles del error:', error);
            const errorMessage = error.message || 'Ocurrió un error inesperado.';
            dispatch({ type: 'SET_ERROR', message: errorMessage });
        } finally {
            dispatch({ type: 'SET_LOADING', value: false });
        }
    };

    return (
        <section className="login-section">
            <ToastContainer />
            <div className="login-container">
                <div className="login-logo-section">
                    <img className="login-logo" src={Logo} alt="Company Logo" />
                </div>
                <div className="login-form-section">
                    <form onSubmit={handleSubmit} className="login-form w-full max-w-md">
                        <div className="login-title-container">
                            <h2 className="login-title">¡Bienvenido, digite credenciales!</h2>
                        </div>
                        <div className="login-fields-container">
                            <div className="login-input-container">
                                <div className="login-icon-container">
                                    <FaEnvelope className="icon" style={{ color: '#022852', fontSize: '1.5rem' }} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Ej. corporativo@miroqui.es"
                                    value={state.email}
                                    onChange={(e) => {
                                        dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value });
                                        dispatch({ type: 'SET_ERROR', message: '' }); // Limpia el error general
                                        dispatch({ type: 'SET_EMAIL_ERROR', message: '' }); // Limpia errores específicos
                                    }}
                                    autoComplete="email"
                                    className={`login-input-field ${state.emailError ? 'input-error' : ''}`}
                                    aria-invalid={!!state.emailError}
                                    aria-describedby="email-error"
                                />
                                {state.emailError && <p id="email-error" className="error-message">{state.emailError}</p>}
                            </div>
                            <div className="login-input-container">
                                <div className="login-icon-container">
                                    <FaLock className="icon" style={{ color: '#022852', fontSize: '1.5rem' }} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Contraseña"
                                    value={state.password}
                                    onChange={(e) => {
                                        dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value });
                                        dispatch({ type: 'SET_ERROR', message: '' }); // Limpia el error general
                                        dispatch({ type: 'SET_PASSWORD_ERROR', message: '' }); // Limpia errores específicos
                                    }}
                                    autoComplete="current-password"
                                    className={`login-input-field ${state.passwordError ? 'input-error' : ''}`}
                                    aria-invalid={!!state.passwordError}
                                    aria-describedby="password-error"
                                />
                                {state.passwordError && <p id="password-error" className="error-message">{state.passwordError}</p>}
                            </div>
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="login-button"
                                    disabled={state.isLoading}
                                    aria-busy={state.isLoading}
                                >
                                    {state.isLoading ? 'Cargando...' : 'Ingresar'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;
