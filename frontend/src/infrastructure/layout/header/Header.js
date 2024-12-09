// src/components/layout/header/Header.js
import React from 'react';
import './Header.css';
import Logo from '../../../assets/logo.png';
import { Avatar } from 'primereact/avatar'; // Importar Avatar de PrimeReact

// Función para capitalizar la primera letra de cada palabra
const capitalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Header = ({ userName, userRole }) => {
  return (
    <header className="header-container">
      {/* Sección del logo */}
      <div className="header-logo-section">
        <img src={Logo} alt="Comercial Hiroqui Logo" className="header-logo" />
      </div>

      {/* Sección del usuario */}
      <div className="header-user-section">
        <div className="header-user-box">
          <Avatar
            icon="pi pi-user"
            shape="circle"
            className="header-user-avatar"
          /> {/* Avatar circular con icono más grande */}
          <div className="header-user-details">
            <p className="header-user-name">{capitalize(userName)}</p>
            <p className="header-user-role">{capitalize(userRole)}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
