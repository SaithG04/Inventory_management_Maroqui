// src/components/layout/header/Header.js
import React from 'react';
import './Header.css';
import Logo from '../../../assets/logo.png';  // Importación de la imagen del logo
import { Avatar } from 'primereact/avatar'; // Importar Avatar de PrimeReact para mostrar el avatar del usuario

// Función para capitalizar la primera letra de cada palabra en un string
const capitalize = (str) => {
  if (!str) return '';  // Si la cadena está vacía, devolver una cadena vacía
  return str
    .toLowerCase()  // Convertir toda la cadena a minúsculas
    .split(' ')  // Dividir la cadena en palabras
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalizar la primera letra de cada palabra
    .join(' ');  // Unir las palabras de nuevo en una sola cadena
};

const Header = ({ userName, userRole }) => {
  return (
    <header className="header-container">
      {/* Sección del logo */}
      <div className="header-logo-section">
        <img src={Logo} alt="Comercial Hiroqui Logo" className="header-logo" />  {/* Imagen del logo */}
      </div>

      {/* Sección del usuario */}
      <div className="header-user-section">
        <div className="header-user-box">
          <Avatar
            icon="pi pi-user"  // Icono de usuario de PrimeReact
            shape="circle"  // Forma circular para el avatar
            className="header-user-avatar"  // Clase CSS para el avatar
          /> 
          {/* Avatar circular con icono más grande */}
          <div className="header-user-details">
            <p className="header-user-name">{capitalize(userName)}</p>  {/* Mostrar el nombre del usuario capitalizado */}
            <p className="header-user-role">{capitalize(userRole)}</p>  {/* Mostrar el rol del usuario capitalizado */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
