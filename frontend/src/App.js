// App.js
import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Header from './components/layout/header/Header';
import Sidebar from './components/layout/sidebar/Sidebar';
import MainContent from './components/layout/maincontent/MainContent';
import Dashboard from './components/DashboardCard/DashboardCard';
import Pedidos from './components/Pedidos/Pedidos';
import Productos from './components/Producto/Productos';
import Sales from './components/Sales/Sales';
import EmployeeManagement from './components/EmployeeManagement/EmployeeManagement';
import Suppliers from './components/Suppliers/Suppliers';
import LoginForm from './components/Login/LoginForm';
import { AuthPort } from './ports/authPort';
import { ProductProvider } from './context/ProductContext';
import Cookies from 'js-cookie';
import Logo from './assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'primeicons/primeicons.css'; // Asegúrate de tener esta importación


const SidebarMemo = React.memo(Sidebar);

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');
    const [activeSection, setActiveSection] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('jwtToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.roles;
                const formattedRole = role.charAt(0).toUpperCase() + role.substring(1).toLowerCase();
                setIsAuthenticated(true);
                setUserRole(formattedRole);
                setUserName(decodedToken.name);
                setDefaultSection(formattedRole);
            } catch (error) {
                console.error('Error decodificando el token:', error);
                setIsAuthenticated(false);
                Cookies.remove('jwtToken');
            }
        }
    }, []);

    const setDefaultSection = (roles) => {
        if (roles === 'Administrator') {
            setActiveSection('dashboard');
        } else if (roles === 'Vendedor') {
            setActiveSection('ventas');
        } else if (roles === 'Almacenero') {
            setActiveSection('producto');
        }
    };

    const handleLogin = async (email, password) => {
        setIsLoading(true);
        const result = await AuthPort.loginUser(email, password);
        console.log("Login Result:", result);
        if (result.success) {
            const token = Cookies.get('jwtToken');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    console.log("Decoded Token:", decodedToken);
                    const role = decodedToken.roles;
                    const formattedRole = role.charAt(0).toUpperCase() + role.substring(1).toLowerCase();
                    setIsAuthenticated(true);
                    setUserRole(formattedRole);
                    setUserName(decodedToken.name);
                    setDefaultSection(formattedRole);
                } catch (error) {
                    console.error('Error decodificando el token:', error);
                    setIsAuthenticated(false);
                    Cookies.remove('jwtToken');
                }
            } else {
                console.error('Token not found after successful login');
            }
        } else {
            toast.error(result.message);
        }
        setIsLoading(false);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole('');
        setUserName('');
        setActiveSection('');
        Cookies.remove('jwtToken');
        navigate('/');
    };

    const handleButtonClick = (action) => {
        if (action === 'salir') {
            handleLogout();
        } else if (action !== activeSection) {
            setActiveSection(action);
        }
    };

    const renderModuleContent = useMemo(() => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard />;
            case 'pedidos':
                return <Pedidos />;
            case 'producto':
                return <Productos userRole={userRole} />;
            case 'ventas':
                return <Sales />;
            case 'empleados':
                return <EmployeeManagement />;
            case 'suppliers':
                return <Suppliers />;
            default:
                return <Dashboard />;
        }
    }, [activeSection, userRole]);

    return (
        <ProductProvider>
            <div className="app-container">
                {isLoading ? (
                    <div className="loading-container">
                        <img src={Logo} alt="Loading..." className="loading-logo" />
                    </div>
                ) : isAuthenticated ? (
                    <>
                        <Header className="header" />
                        <div className="main-layout">
                            <SidebarMemo
                                className="sidebar"
                                userRole={userRole}
                                userName={userName}
                                onButtonClick={handleButtonClick}
                                onLogout={handleLogout}
                            />
                            <MainContent className="main-content">{renderModuleContent}</MainContent>
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
