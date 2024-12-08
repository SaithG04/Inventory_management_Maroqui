import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Header from './components/layout/header/Header';
import Sidebar from './components/layout/sidebar/Sidebar';
import MainContent from './components/layout/maincontent/MainContent';
import Dashboard from './components/DashboardCard/DashboardCard';
import ParentComponentOrder from './orders/infrastructure/components/ParentComponentOrder'; // NUEVO
import ParentComponentProduct from './products/infraestructure/components/ParentComponentProduct';
import ParentComponentEmployee from './employees/infrastructure/components/ParentComponentEmployee';
import Sales from './components/Sales/Sales';
import ParentComponentProvider from './providers/infrastructure/components/ParentComponentProvider'; // Importamos el componente de proveedores
import LoginForm from './components/Login/LoginForm';
import { AuthPort } from './ports/authPort';
import { ProductProvider } from './context/ProductContext';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from './assets/logo.png'; // Importar el logo de la aplicación
import config from './config'; // Importar el archivo de configuración centralizada

// Obtenemos el rol predeterminado desde el archivo de configuración
const DEFAULT_ROLE = config.DEFAULT_ROLE; // Usar la configuración centralizada

function App() {
  // Definición de los estados locales
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar si el usuario está autenticado
  const [userRole, setUserRole] = useState(DEFAULT_ROLE); // Estado para el rol del usuario
  const [userName, setUserName] = useState(''); // Estado para el nombre del usuario
  const [activeSection, setActiveSection] = useState('dashboard'); // Estado para la sección activa, inicialmente en "dashboard"
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el indicador de carga

  // Hook para verificar si el usuario ya tiene un token almacenado (sesión activa)
  useEffect(() => {
    const token = Cookies.get('jwtToken');
    if (token) {
      try {
        // Si el token existe, se decodifica y se configuran los estados correspondientes
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

  // Función para configurar la sección predeterminada en función del rol del usuario
  const setDefaultSection = (roles) => {
    if (roles === 'Administrator') {
      setActiveSection('dashboard');
    } else if (roles === 'Vendedor') {
      setActiveSection('ventas');
    } else if (roles === 'Almacenero') {
      setActiveSection('pedidos'); // NUEVO
    }
  };
  

  // Función para manejar el inicio de sesión
  const handleLogin = async (email, password) => {
    setIsLoading(true); // Iniciar el indicador de carga

    try {
      const result = await AuthPort.loginUser(email, password);

      if (result.success) {
        console.log("Inicio de sesión exitoso.");
        const token = Cookies.get('jwtToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          const role = decodedToken.roles;

          // Actualizar estados después del inicio de sesión exitoso
          setIsAuthenticated(true);
          setUserRole(role);
          setUserName(decodedToken.name);
          setDefaultSection(role);
          console.log("Autenticación exitosa, usuario autenticado:", decodedToken.name);

          // Detener el indicador de carga después de la autenticación exitosa
          setIsLoading(false);
        } else {
          throw new Error("Token no disponible después de autenticación exitosa.");
        }
      } else {
        // Si las credenciales no son válidas, detener la carga y mostrar el error
        setIsLoading(false);

        // Mostrar notificación de error después de un pequeño retraso
        setTimeout(() => {
          toast.error(result.message || 'Credenciales incorrectas. Por favor, intente nuevamente.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }, 200); // Retraso de 200ms
      }
    } catch (error) {
      console.error('Error durante el proceso de inicio de sesión:', error);
      setIsLoading(false);

      // Mostrar notificación de error de conexión después de un pequeño retraso
      setTimeout(() => {
        toast.error('Ha ocurrido un error. Por favor, intente nuevamente.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }, 200); // Retraso de 200ms
    }
  };

  // Función para cambiar de sección en la interfaz
  const handleButtonClick = (section) => {
    if (section !== activeSection) {
      setActiveSection(section);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    Cookies.remove('jwtToken');
    setIsAuthenticated(false);
    setUserRole(DEFAULT_ROLE);
    setActiveSection('dashboard');
    toast.success('Has cerrado sesión exitosamente.');
  };

  // Definir qué contenido mostrar en función de la sección activa
  const renderModuleContent = useMemo(() => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'pedidos': // NUEVO
        return <ParentComponentOrder />;
      case 'producto':
        return <ParentComponentProduct />;
      case 'ventas':
        return <Sales />;
      case 'empleados':
        return <ParentComponentEmployee />;
      case 'proveedores':
        return <ParentComponentProvider />;
      default:
        return <Dashboard />;
    }
  }, [activeSection]); // Solo activeSection como dependencia
  

  // Renderizado principal de la aplicación
  return (
    <ProductProvider>
      <div className="app-container">
        <ToastContainer />
        {isLoading ? (
          // Mostrar el indicador de carga mientras se procesa el inicio de sesión
          <div className="loading-container">
            <img src={Logo} alt="Loading..." className="loading-logo" />
          </div>
        ) : isAuthenticated ? (
          // Mostrar la aplicación una vez autenticado
          <>
            <Header userName={userName} userRole={userRole} />
            <div className="main-layout">
              <Sidebar
                userRole={userRole}
                userName={userName}
                onButtonClick={handleButtonClick}
                onLogout={handleLogout}
              />
              <MainContent>{renderModuleContent}</MainContent>
            </div>
          </>
        ) : (
          // Mostrar el formulario de inicio de sesión si el usuario no está autenticado
          <LoginForm onLogin={handleLogin} />
        )}

      </div>
    </ProductProvider>
  );
}

export default App;
