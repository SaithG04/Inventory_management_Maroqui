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
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Obtenemos el rol predeterminado desde .env
const DEFAULT_ROLE = process.env.REACT_APP_DEFAULT_ROLE || 'User';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(DEFAULT_ROLE);
  const [userName, setUserName] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard'); // Inicio por defecto
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get('jwtToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.roles;
        setIsAuthenticated(true);
        setUserRole(role);
        setUserName(decodedToken.name);
        setDefaultSection(role);
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
    if (result.success) {
      const token = Cookies.get('jwtToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const role = decodedToken.roles;
          setIsAuthenticated(true);
          setUserRole(role);
          setUserName(decodedToken.name);
          setDefaultSection(role);
        } catch (error) {
          console.error('Error decodificando el token:', error);
          setIsAuthenticated(false);
          Cookies.remove('jwtToken');
        }
      }
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const handleButtonClick = (section) => {
    if (section !== activeSection) {
      setActiveSection(section);
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
          <div>Loading...</div>
        ) : isAuthenticated ? (
          <>
            <Header />
            <div className="main-layout">
              <Sidebar
                userRole={userRole}
                userName={userName}
                onButtonClick={handleButtonClick}
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
