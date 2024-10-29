// src/App.js
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import Modal from './components/Modal/Modal';
import LoginForm from './components/Login/LoginForm';
import '@fortawesome/fontawesome-free/css/all.min.css';



function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación

  const handleButtonClick = (section) => {
    if (section === 'salir') {
      setShowModal(true);
    } else {
      setActiveSection(section);
      console.log(`Navegando a: ${section}`);
    }
  };

  const handleConfirmExit = () => {
    console.log('Cerrando sesión...');
    setIsAuthenticated(false); // Cerrar sesión
    setActiveSection(null);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Función para manejar el inicio de sesión exitoso
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <>
          <Header />
          <div className="main-layout">
            <Sidebar onButtonClick={handleButtonClick} />
            <MainContent activeSection={activeSection} />
          </div>
          <Modal show={showModal} onClose={handleCloseModal} onConfirm={handleConfirmExit} />
        </>
      ) : (
        <LoginForm onLogin={handleLogin} /> // Mostrar login si no está autenticado
      )}
    </div>
  );
}

export default App;
