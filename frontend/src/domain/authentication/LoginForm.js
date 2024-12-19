import React, { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import Logo from '../../assets/logo.png';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Estado inicial del formulario, donde se definen los valores iniciales de las variables
const initialState = {
    email: '', // Estado del email
    password: '', // Estado de la contraseña
    error: '', // Mensaje de error general
    success: false, // Indica si el login fue exitoso
    emailError: '', // Error específico del campo email
    passwordError: '', // Error específico del campo contraseña
    isLoading: false, // Controla si el formulario está en estado de carga
};

// Función reductora que actualiza el estado del formulario basado en las acciones despachadas
function reducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value }; // Actualiza un campo específico
        case 'SET_ERROR':
            return { ...state, error: action.message }; // Establece el mensaje de error general
        case 'SET_SUCCESS':
            return { ...state, success: action.value }; // Marca si el login fue exitoso
        case 'SET_EMAIL_ERROR':
            return { ...state, emailError: action.message }; // Establece el error del email
        case 'SET_PASSWORD_ERROR':
            return { ...state, passwordError: action.message }; // Establece el error de la contraseña
        case 'SET_LOADING':
            return { ...state, isLoading: action.value }; // Establece el estado de carga
        default:
            return state; // Devuelve el estado sin cambios si la acción no es reconocida
    }
}

const LoginForm = ({ onLogin }) => {
    const [state, dispatch] = useReducer(reducer, initialState); // Hook para manejar el estado del formulario
    const navigate = useNavigate(); // Hook para redirigir después del login

    // useEffect que se ejecuta cuando el estado cambia. Maneja notificaciones y redirecciones
    useEffect(() => {
        if (state.success) {
            dispatch({ type: 'SET_ERROR', message: '' }); // Limpia los errores
            dispatch({ type: 'SET_EMAIL_ERROR', message: '' });
            dispatch({ type: 'SET_PASSWORD_ERROR', message: '' });
            toast.success('Inicio de sesión exitoso'); // Muestra la notificación de éxito
            navigate('/dashboard'); // Redirige al dashboard después del login
        }
        if (state.error) {
            toast.dismiss(); // Cierra cualquier notificación previa
            toast.error(state.error); // Muestra el mensaje de error general
        }
        if (state.emailError) {
            toast.dismiss(); // Cierra cualquier notificación previa
            toast.warn(state.emailError); // Muestra el error del email
        }
        if (state.passwordError) {
            toast.dismiss(); // Cierra cualquier notificación previa
            toast.warn(state.passwordError); // Muestra el error de la contraseña
        }
    }, [state.success, state.error, state.emailError, state.passwordError, navigate]); // Se ejecuta cuando cambia alguno de los estados

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        // Verifica si los campos email o password están vacíos
        if (!state.email || !state.password) {
            toast.dismiss(); // Cierra cualquier notificación previa
            toast.warn('Por favor, complete todos los campos.'); // Muestra la advertencia
            return;
        }

        dispatch({ type: 'SET_LOADING', value: true }); // Marca el formulario como cargando

        try {
            const response = await onLogin(state.email, state.password); // Llama a la función onLogin que se pasa como prop

            // Verifica la respuesta de login y si es exitosa, establece el estado de éxito
            if (response.success && response.token) {
                dispatch({ type: 'SET_SUCCESS', value: true });
            } else {
                throw new Error(response.message || 'Credenciales inválidas.'); // Muestra un mensaje de error si las credenciales son incorrectas
            }
        } catch (error) {
            const errorMessage = error.message || 'Ocurrió un error inesperado.'; // Mensaje de error en caso de fallar
            dispatch({ type: 'SET_ERROR', message: errorMessage }); // Establece el mensaje de error
        } finally {
            dispatch({ type: 'SET_LOADING', value: false }); // Finaliza el estado de carga
        }
    };

    return (
        <section className="login-section">
            <ToastContainer /> {/* Contenedor para las notificaciones */}
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
                                    aria-invalid={!!state.emailError} // Marca el campo como inválido si hay un error
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
                                    aria-invalid={!!state.passwordError} // Marca el campo como inválido si hay un error
                                    aria-describedby="password-error"
                                />
                                {state.passwordError && <p id="password-error" className="error-message">{state.passwordError}</p>}
                            </div>
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    className="login-button"
                                    disabled={state.isLoading}  // Bloquea el botón si 'isLoading' es true
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
