// src/components/Sidebar/Sidebar.js
import React from 'react';
import { FaChartLine, FaClipboardList, FaShoppingCart, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ onButtonClick, userRole, userName }) => {
  const modulesByRole = {
    Administrador: ['dashboard', 'producto', 'ventas', 'empleados', 'suppliers'],
    Almacenero: ['dashboard', 'producto'],
    Vendedor: ['dashboard', 'ventas']
  };

  const allowedModules = modulesByRole[userRole] || [];

  return (
    <div className="sidebar">
       <div className="profile-section">
        <p>Usuario: <strong>{userRole}</strong></p>
        <p>Nombre: <span className="user-name">{userName}</span></p> {/* Nombre en la misma línea */}
      </div>

      <ul className="menu-list">
        {allowedModules.includes('dashboard') && (
          <li onClick={() => onButtonClick('dashboard')}>
            <FaChartLine className="icon" /> Dashboard
          </li>
        )}
        {allowedModules.includes('producto') && (
          <li onClick={() => onButtonClick('producto')}>
            <FaClipboardList className="icon" /> Productos
          </li>
        )}
        {allowedModules.includes('ventas') && (
          <li onClick={() => onButtonClick('ventas')}>
            <FaShoppingCart className="icon" /> Ventas
          </li>
        )}
        {allowedModules.includes('empleados') && (
          <li onClick={() => onButtonClick('empleados')}>
            <FaUsers className="icon" /> Empleados
          </li>
        )}
        {allowedModules.includes('suppliers') && (
          <li onClick={() => onButtonClick('suppliers')}>
            <FaUsers className="icon" /> Proveedores
          </li>
        )}
        <li onClick={() => onButtonClick('salir')} className="logout-button">
        <FaSignOutAlt className="icon" /> Salir
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
