import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import Dashboard from './components/DashboardCard/DashboardCard';
import Productos from './components/Producto/Productos';
import Sales from './components/Sales/Sales';
import EmployeeManagement from './components/EmployeeManagement/EmployeeManagement';
import Suppliers from './components/Suppliers/Suppliers';
import LoginForm from './components/Login/LoginForm';
import { AuthPort } from './ports/authPort';
import { ProductProvider } from './context/ProductContext';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const token = Cookies.get('jwtToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.roles;
                const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(); // Convierte la primera letra en mayúscula
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
        if (roles === 'Administrador') {
            setActiveSection('dashboard');
        } else if (roles === 'Vendedor') {
            setActiveSection('ventas');
        } else if (roles === 'Almacenero') {
            setActiveSection('producto');
        }
    };

    const handleLogin = async (email, password) => {
        const result = await AuthPort.loginUser(email, password);
        if (result.success) {
            setIsAuthenticated(true);

            // Decodificar el token inmediatamente para actualizar el estado
            const token = Cookies.get('jwtToken');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setUserRole(decodedToken.roles);
                    setUserName(decodedToken.name);
                } catch (error) {
                    console.error('Error decodificando el token:', error);
                    setIsAuthenticated(false);
                    Cookies.remove('jwtToken');
                }
            }

            setDefaultSection(result.role);
        } else {
            alert(result.message);
        }
    };
    


    const handleButtonClick = (action) => {
        if (action === 'salir') {
            setIsAuthenticated(false);
            setUserRole('');
            setUserName('');
            setActiveSection('');

            // Remover el token al cerrar sesión
            Cookies.remove('jwtToken');
        } else {
            setActiveSection(action);
        }
    };

    const renderModuleContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard />;
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
    };

    return (
        <ProductProvider>
            <div className="app-container">
                {isAuthenticated ? (
                    <>
                        <Header className="header" />
                        <div className="main-layout">
                            <Sidebar
                                className="sidebar"
                                userRole={userRole}
                                userName={userName}
                                onButtonClick={handleButtonClick}
                            />
                            <MainContent className="main-content">{renderModuleContent()}</MainContent>
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
