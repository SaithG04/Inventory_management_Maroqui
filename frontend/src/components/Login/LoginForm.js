// Importa React y dos hooks: useReducer para manejar el estado complejo del formulario y useEffect para efectos secundarios.
import React, { useReducer, useEffect } from 'react';

// useNavigate se utiliza para redirigir al usuario a una ruta diferente después de una acción, como un inicio de sesión exitoso.
import { useNavigate } from 'react-router-dom';

// Importa el archivo de estilos CSS específico para el formulario de inicio de sesión.
import './LoginForm.css';

// Importa el logo de la empresa que se mostrará en la pantalla de inicio de sesión.
import Logo from '../../assets/logo.png';

// Importa los íconos de correo y candado de la librería react-icons para mejorar la interfaz del formulario.
import { FaEnvelope, FaLock } from 'react-icons/fa';

// Importa Toast para notificaciones emergentes (errores, advertencias, etc.) y su contenedor.
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Estado inicial del formulario, contiene los campos de email, contraseña y mensajes de error/success.
const initialState = {
    email: '',
    password: '',
    error: '',
    success: false,
    emailError: '',
    passwordError: '',
};

// Función reductora que actualiza el estado del formulario según la acción recibida.
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
        default:
            return state;
    }
}

// Componente LoginForm que gestiona el formulario de inicio de sesión.
const LoginForm = ({ onLogin }) => {
    // useReducer para gestionar el estado del formulario.
    const [state, dispatch] = useReducer(reducer, initialState);

    // useNavigate se utiliza para redirigir al usuario a otra página tras un inicio de sesión exitoso.
    const navigate = useNavigate();

    // useEffect para manejar acciones después de cambios en el estado, como mostrar mensajes o redirigir al usuario.
    useEffect(() => {
        if (state.success) {
            navigate('/dashboard'); // Navegar al dashboard después del inicio de sesión exitoso.
        }
        if (state.error) {
            toast.error(state.error); // Mostrar mensaje de error.
        }
        if (state.emailError) {
            toast.warn(state.emailError); // Mostrar advertencia de error en el email.
        }
        if (state.passwordError) {
            toast.warn(state.passwordError); // Mostrar advertencia de error en la contraseña.
        }
    }, [state.success, state.error, state.emailError, state.passwordError, navigate]);

    // Maneja el envío del formulario.
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Si los campos están vacíos, mostrar advertencia.
        if (!state.email || !state.password) {
            toast.warn('Por favor complete todos los campos.');
            return;
        }
    
        // Llama a la función de autenticación proporcionada por `App.js`.
        onLogin(state.email, state.password);
    };
    
    return (
        <section className="login-section">
            <ToastContainer /> {/* Contenedor para notificaciones emergentes */}
            <div className="login-container">
                <div className="login-logo-section">
                    <img
                        className="login-logo"
                        src={Logo} // Muestra el logotipo de la empresa.
                        alt="Company Logo"
                    />
                </div>

                <div className="login-form-section">
                    <form onSubmit={handleSubmit} className="login-form w-full max-w-md">
                        <div className="login-title-container">
                            <h2 className="login-title">¡Bienvenido, Digite Credenciales!</h2> {/* Título del formulario */}
                        </div>

                        <div className="login-fields-container">
                            {/* Campo de Email */}
                            <div className="login-input-container">
                                <div className="login-icon-container">
                                    <FaEnvelope className="icon" style={{ color: '#022852', fontSize: '1.5rem' }} /> {/* Ícono de correo */}
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
                                    <FaLock className="icon" style={{ color: '#022852', fontSize: '1.5rem' }} /> {/* Ícono de contraseña */}
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
                                <button type="submit" className="login-button">
                                    Ingresar {/* Botón para enviar el formulario */}
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
