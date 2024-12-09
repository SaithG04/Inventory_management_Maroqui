import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import Header from './components/layout/header/Header';
import Sidebar from './components/layout/sidebar/Sidebar';
import MainContent from './components/layout/maincontent/MainContent';
import Dashboard from './components/DashboardCard/DashboardCard';
import ParentComponentOrder from './orders/infrastructure/components/ParentComponentOrder';
import ParentComponentProduct from './products/infraestructure/components/ParentComponentProduct';
import ParentComponentEmployee from './employees/infrastructure/components/ParentComponentEmployee';
import Sales from './components/Sales/Sales';
import ParentComponentProvider from './providers/infrastructure/components/ParentComponentProvider';
import LoginForm from './components/Login/LoginForm';
import { AuthPort } from './ports/authPort';
import { ProductProvider } from './context/ProductContext';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Logo from './assets/logo.png';
import config from './config';

const DEFAULT_ROLE = config.DEFAULT_ROLE;

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(DEFAULT_ROLE);
    const [userName, setUserName] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);

    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    // Verificar autenticación y establecer la sección activa
    useEffect(() => {
        const token = Cookies.get('jwtToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log('Token decodificado:', decodedToken);
                setIsAuthenticated(true);
                setUserRole(decodedToken.roles || []);
                setUserName(decodedToken.fullname || '');
                setDefaultSection(decodedToken.roles);
            } catch (err) {
                console.error('Error al decodificar el token:', err);
                Cookies.remove('jwtToken');
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
        setIsLoaded(true);
    }, []);
    
    

    useEffect(() => {
        console.log('isAuthenticated has changed:', isAuthenticated);

        if (isAuthenticated) {
            console.log('User is authenticated, checking roles...');
            if (Array.isArray(userRole)) {
                console.log('User roles:', userRole);
                if (userRole.includes('ADMINISTRATOR')) {
                    console.log('Redirecting to /dashboard');
                    navigateRef.current('/dashboard');
                } else if (userRole.includes('SELLER')) {
                    console.log('Redirecting to /ventas');
                    navigateRef.current('/ventas');
                } else if (userRole.includes('WAREHOUSE CLERK')) {
                    console.log('Redirecting to /producto');
                    navigateRef.current('/producto');
                } else {
                    console.log('No matching role, redirecting to default');
                    navigateRef.current('/');
                }
            } else {
                console.log('User role:', userRole);
                switch (userRole) {
                    case 'ADMINISTRATOR':
                        console.log('Redirecting to /dashboard');
                        navigateRef.current('/dashboard');
                        break;
                    case 'SELLER':
                        console.log('Redirecting to /ventas');
                        navigateRef.current('/ventas');
                        break;
                    case 'WAREHOUSE CLERK':
                        console.log('Redirecting to /producto');
                        navigateRef.current('/producto');
                        break;
                    default:
                        console.log('No matching role, redirecting to default');
                        navigateRef.current('/');
                        break;
                }
            }
        }
    }, [isAuthenticated, userRole]);

    const setDefaultSection = (roles) => {
        console.log('Setting default section based on roles:', roles);
        const roleToSectionMap = {
            ADMINISTRATOR: 'dashboard',
            SELLER: 'ventas',
            'WAREHOUSE CLERK': 'producto',
        };
        if (Array.isArray(roles)) {
            const validRole = roles.find((role) => roleToSectionMap[role]);
            setActiveSection(validRole ? roleToSectionMap[validRole] : 'dashboard');
        } else {
            setActiveSection(roleToSectionMap[roles] || 'dashboard');
        }
    };

    const handleLogin = async (email, password) => {
        try {
            const response = await AuthPort.loginUser(email, password);
            
            if (response.success) {
                const token = Cookies.get('jwtToken');
                if (token) {
                    console.log('Token recibido en handleLogin:', token);
                    setIsAuthenticated(true);
                    const decodedToken = jwtDecode(token);
                    setUserRole(decodedToken.roles || []);
                    setUserName(decodedToken.fullname || '');
                    setDefaultSection(decodedToken.roles);
                } else {
                    throw new Error('No se recibió un token de acceso.');
                }
            } else {
                console.error('Error en la respuesta de autenticación:', response.message);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error en la autenticación:', error);
            setIsAuthenticated(false);
        }
    };
    



    const handleLogout = () => {
        console.log('Logging out...');
        Cookies.remove('jwtToken');
        setIsAuthenticated(false);
        setUserRole(DEFAULT_ROLE);
        setActiveSection('dashboard');
        toast.success('Has cerrado sesión exitosamente.');
        navigateRef.current('/');
    };

    const renderModuleContent = useMemo(() => {
        console.log('Rendering module content for section:', activeSection);
        const sectionMap = {
            dashboard: <Dashboard />,
            pedidos: <ParentComponentOrder />,
            producto: <ParentComponentProduct />,
            ventas: <Sales />,
            empleados: <ParentComponentEmployee />,
            proveedores: <ParentComponentProvider />,
        };
        return sectionMap[activeSection] || <Dashboard />;
    }, [activeSection]);

    if (!isLoaded) {
        return <div>Cargando...</div>;
    }

    return (
        <ProductProvider>
            <div className="app-container">
                <ToastContainer />
                {isLoading ? (
                    <div className="loading-container">
                        <img src={Logo} alt="Loading..." className="loading-logo" />
                    </div>
                ) : isAuthenticated ? (
                    <>
                        <Header userName={userName} userRole={userRole} />
                        <div className="main-layout">
                            <Sidebar
                                userRole={userRole}
                                userName={userName}
                                onButtonClick={setActiveSection}
                                onLogout={handleLogout}
                            />
                            <MainContent>{renderModuleContent}</MainContent>
                        </div>
                    </>
                ) : (
                    <LoginForm onLogin={handleLogin} />
                )}
            </div>
        </ProductProvider>
    );
}

export default App;
