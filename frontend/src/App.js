import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import Header from './infrastructure/layout/header/Header';
import Sidebar from './infrastructure/layout/sidebar/Sidebar';
import MainContent from './infrastructure/layout/maincontent/MainContent';
import Dashboard from './domain/DashboardCard/DashboardCard';
import ParentComponentOrder from './domain/orders/infrastructure/components/ParentComponentOrder';
import ParentComponentProduct from './domain/products/infraestructure/components/ParentComponentProduct';
import ParentComponentEmployee from './domain/employees/infrastructure/components/ParentComponentEmployee';
import Sales from './components/Sales/Sales';
import ParentComponentProvider from './domain/providers/infrastructure/components/ParentComponentProvider';
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
                setIsAuthenticated(true);
                setUserRole(decodedToken.roles || []);
                setUserName(decodedToken.fullname || '');
                setDefaultSection(decodedToken.roles);
            } catch (err) {
                Cookies.remove('jwtToken');
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
        setIsLoaded(true);
    }, []);
    
    

    useEffect(() => {

        if (isAuthenticated) {
            if (Array.isArray(userRole)) {
                if (userRole.includes('ADMINISTRATOR')) {
                    navigateRef.current('/dashboard');
                } else if (userRole.includes('SELLER')) {
                    navigateRef.current('/ventas');
                } else if (userRole.includes('WAREHOUSE CLERK')) {
                    navigateRef.current('/producto');
                } else {
                    navigateRef.current('/');
                }
            } else {
                switch (userRole) {
                    case 'ADMINISTRATOR':
                        navigateRef.current('/dashboard');
                        break;
                    case 'SELLER':
                        navigateRef.current('/ventas');
                        break;
                    case 'WAREHOUSE CLERK':
                        navigateRef.current('/producto');
                        break;
                    default:
                        navigateRef.current('/');
                        break;
                }
            }
        }
    }, [isAuthenticated, userRole]);

    const setDefaultSection = (roles) => {
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
                const token = Cookies.get('jwtToken'); // Asegúrate de que el token existe
    
                if (token) {
                    const decodedToken = jwtDecode(token);
    
                    setIsAuthenticated(true);
                    setUserRole(decodedToken.roles || []);
                    setUserName(decodedToken.fullname || '');
                    setDefaultSection(decodedToken.roles);
                } else {
                    throw new Error('No se recibió un token de acceso.');
                }
            } else {
                toast.error(response.message || 'Error de autenticación.');
                setIsAuthenticated(false);
            }
        } catch (error) {
            toast.error('Ocurrió un error al iniciar sesión.');
            setIsAuthenticated(false);
        }
    };
    
    
    const handleLogout = () => {
        Cookies.remove('jwtToken');
        setIsAuthenticated(false);
        setUserRole(DEFAULT_ROLE);
        setActiveSection('dashboard');
        toast.success('Has cerrado sesión exitosamente.');
        navigateRef.current('/');
    };

    const renderModuleContent = useMemo(() => {
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
