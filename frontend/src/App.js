import React, { useState, useEffect, useMemo, useRef } from 'react';  // Importación de hooks y librerías de React
import './App.css';  // Importación de los estilos CSS
import Header from './infrastructure/layout/header/Header';  // Importación de componentes de la interfaz
import Sidebar from './infrastructure/layout/sidebar/Sidebar';
import MainContent from './infrastructure/layout/maincontent/MainContent';
import Dashboard from './domain/dashboardcard/DashboardCard';
import ParentComponentOrder from './domain/orders/infrastructure/components/ParentComponentOrder';
import ParentComponentProduct from './domain/products/infraestructure/components/ParentComponentProduct';
import ParentComponentEmployee from './domain/employees/infrastructure/components/ParentComponentEmployee';
// import Sales from './components/Sales/Sales';
import ParentComponentProvider from './domain/providers/infrastructure/components/ParentComponentProvider';
import LoginForm from './domain/authentication/LoginForm';  // Formulario de login
import { AuthPort } from './ports/authPort';  // Lógica de autenticación
import Cookies from 'js-cookie';  // Librería para manejo de cookies
import { jwtDecode } from 'jwt-decode';  // Librería para decodificar JWT
import { toast, ToastContainer } from 'react-toastify';  // Librería para mostrar notificaciones
import { useNavigate } from 'react-router-dom';  // Hook para navegación
import 'react-toastify/dist/ReactToastify.css';  // Importación de los estilos de Toast
import Logo from './assets/logo.png';  // Logo de la aplicación
import config from './config';  // Configuración global

const DEFAULT_ROLE = config.DEFAULT_ROLE;  // Establecer el rol predeterminado

function App() {
    // Definición de los estados locales
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado para saber si el usuario está autenticado
    const [userRole, setUserRole] = useState(DEFAULT_ROLE);  // Estado para almacenar el rol del usuario
    const [userName, setUserName] = useState('');  // Estado para almacenar el nombre del usuario
    const [activeSection, setActiveSection] = useState('dashboard');  // Estado para la sección activa
    const [isLoading] = useState(false);  // Estado de carga (no se usa aquí, pero se mantiene para posibles modificaciones)
    const [isLoaded, setIsLoaded] = useState(false);  // Estado para verificar si los datos están completamente cargados
    const navigate = useNavigate();  // Hook de navegación de React Router
    const navigateRef = useRef(navigate);  // Ref para almacenar la navegación y evitar dependencias en el efecto

    useEffect(() => {
        // Actualiza el valor de navigateRef al cambiar la navegación
        navigateRef.current = navigate;
    }, [navigate]);

    // Verificar si el usuario está autenticado al cargar la aplicación
    useEffect(() => {
        const token = Cookies.get('jwtToken');  // Obtener el token JWT almacenado en cookies
        if (token) {
            try {
                // Intentar decodificar el token y obtener el rol y nombre del usuario
                const decodedToken = jwtDecode(token);
                setIsAuthenticated(true);  // Marcar como autenticado
                setUserRole(decodedToken.roles || []);  // Establecer los roles del usuario
                setUserName(decodedToken.fullname || '');  // Establecer el nombre completo del usuario
                setDefaultSection(decodedToken.roles);  // Establecer la sección predeterminada basada en el rol
            } catch (err) {
                // Si el token no es válido, eliminar el token y marcar como no autenticado
                Cookies.remove('jwtToken');
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);  // Si no hay token, marcar como no autenticado
        }
        setIsLoaded(true);  // Marcar que los datos de autenticación han sido cargados
    }, []);

    // Efecto para redirigir al usuario según su rol
    useEffect(() => {
        if (isAuthenticated) {
            // Si el usuario está autenticado, redirigir según su rol
            if (Array.isArray(userRole)) {
                if (userRole.includes('ADMINISTRATOR')) {
                    navigateRef.current('/dashboard');
                } else if (userRole.includes('SELLER')) {
                    // navigateRef.current('/ventas');  // Redirigir a ventas si el rol es 'SELLER'
                } else if (userRole.includes('WAREHOUSE CLERK')) {
                    navigateRef.current('/producto');
                } else {
                    navigateRef.current('/');  // Redirigir a la página principal si no se tiene un rol reconocido
                }
            } else {
                // Si el rol no es un array, redirigir directamente según el rol
                switch (userRole) {
                    case 'ADMINISTRATOR':
                        navigateRef.current('/dashboard');
                        break;
                    case 'SELLER':
                        // navigateRef.current('/ventas');
                        break;
                    case 'WAREHOUSE CLERK':
                        navigateRef.current('/producto');
                        break;
                    default:
                        navigateRef.current('/');  // Redirigir al inicio si el rol no es válido
                        break;
                }
            }
        }
    }, [isAuthenticated, userRole]);  // Dependencias: cuando cambian la autenticación o el rol

    // Establecer la sección predeterminada según el rol
    const setDefaultSection = (roles) => {
        const roleToSectionMap = {
            ADMINISTRATOR: 'dashboard',
            // SELLER: 'ventas',  // Comentado ya que no se usa
            'WAREHOUSE CLERK': 'producto',
        };
        if (Array.isArray(roles)) {
            // Si roles es un array, buscar el primer rol válido
            const validRole = roles.find((role) => roleToSectionMap[role]);
            setActiveSection(validRole ? roleToSectionMap[validRole] : 'dashboard');
        } else {
            // Si el rol es una cadena, asignar la sección directamente
            setActiveSection(roleToSectionMap[roles] || 'dashboard');
        }
    };

    // Manejar el inicio de sesión
    const handleLogin = async (email, password) => {
        try {
            const response = await AuthPort.loginUser(email, password);  // Enviar solicitud de login

            if (response.success) {
                const token = Cookies.get('jwtToken');  // Obtener el token guardado

                if (token) {
                    const decodedToken = jwtDecode(token);  // Decodificar el token

                    setIsAuthenticated(true);  // Marcar como autenticado
                    setUserRole(decodedToken.roles || []);  // Establecer los roles del usuario
                    setUserName(decodedToken.fullname || '');  // Establecer el nombre completo
                    setDefaultSection(decodedToken.roles);  // Establecer la sección predeterminada
                } else {
                    throw new Error('No se recibió un token de acceso.');
                }
            } else {
                toast.error(response.message || 'Error de autenticación.');  // Mostrar mensaje de error si el login falla
                setIsAuthenticated(false);
            }
        } catch (error) {
            toast.error('Ocurrió un error al iniciar sesión.');  // Error general si ocurre algo inesperado
            setIsAuthenticated(false);
        }
    };

    // Manejar el cierre de sesión
    const handleLogout = () => {
        Cookies.remove('jwtToken');  // Eliminar el token de las cookies
        setIsAuthenticated(false);  // Marcar como no autenticado
        setUserRole(DEFAULT_ROLE);  // Restaurar el rol predeterminado
        setActiveSection('dashboard');  // Establecer la sección activa como 'dashboard'
        toast.success('Has cerrado sesión exitosamente.');  // Notificar al usuario
        navigateRef.current('/');  // Redirigir al inicio
    };

    // Renderizar el contenido de cada módulo basado en la sección activa
    const renderModuleContent = useMemo(() => {
        const sectionMap = {
            dashboard: <Dashboard />,  // Mostrar el Dashboard para la sección 'dashboard'
            pedidos: <ParentComponentOrder />,  // Mostrar los pedidos
            producto: <ParentComponentProduct />,  // Mostrar los productos
            // ventas: <Sales />  // Comentado, no usado en el código
            empleados: <ParentComponentEmployee />,  // Mostrar empleados
            proveedores: <ParentComponentProvider />,  // Mostrar proveedores
        };
        return sectionMap[activeSection] || <Dashboard />;  // Por defecto mostrar el Dashboard si la sección no está definida
    }, [activeSection]);

    if (!isLoaded) {
        return <div>Cargando...</div>;  // Mostrar mensaje de carga mientras se verifica la autenticación
    }

    return (
        <div className="app-container">
            <ToastContainer />  { /*Contenedor para mostrar las notificaciones*/}
            {isLoading ? (
                <div className="loading-container">
                    <img src={Logo} alt="Loading..." className="loading-logo" />  { /* // Mostrar logo mientras se carga*/}
                </div>
            ) : isAuthenticated ? (
                // Si el usuario está autenticado, mostrar la interfaz principal
                <>
                    <Header userName={userName} userRole={userRole} />
                    <div className="main-layout">
                        <Sidebar
                            userRole={userRole}
                            userName={userName}
                            onButtonClick={setActiveSection}  // Cambiar la sección activa cuando se hace clic en un botón
                            onLogout={handleLogout}  // Cerrar sesión
                        />
                        <MainContent>{renderModuleContent}</MainContent>
                    </div>
                </>
            ) : (
                // Si no está autenticado, mostrar el formulario de login
                <LoginForm onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
