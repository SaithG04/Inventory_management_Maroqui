// src/App.js
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

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated === 'true') {
            setIsAuthenticated(true);
            const role = localStorage.getItem('userRole');
            setUserRole(role);
            setUserName(localStorage.getItem('userName'));
            setDefaultSection(role);
        }

        const initialEmployees = [
            { id: 1, fullName: 'Teddy Alexander', email: 'admin@miroqui.es', password: 'password123', role: 'Administrador', status: 'Activo' },
            { id: 2, fullName: 'María López', email: 'vendedor@miroqui.es', password: 'vendedor123', role: 'Vendedor', status: 'Activo' },
            { id: 3, fullName: 'Carlos Sánchez', email: 'almacenero@miroqui.es', password: 'almacenero123', role: 'Almacenero', status: 'Activo' },
        ];

        if (!localStorage.getItem('employees')) {
            localStorage.setItem('employees', JSON.stringify(initialEmployees));
        }
    }, []);

    const setDefaultSection = (role) => {
        if (role === 'Administrador') {
            setActiveSection('dashboard');
        } else if (role === 'Vendedor') {
            setActiveSection('ventas');
        } else if (role === 'Almacenero') {
            setActiveSection('producto');
        }
    };

    const handleLogin = async (email, password) => {
        const result = await AuthPort.loginUser(email, password);
        if (result.success) {
            setIsAuthenticated(true);
            setUserRole(result.role);
            setUserName(result.fullName);

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', result.role);
            localStorage.setItem('userName', result.fullName);

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

            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
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
        <ProductProvider> {/* Envuelve toda la aplicación con ProductProvider */}
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
