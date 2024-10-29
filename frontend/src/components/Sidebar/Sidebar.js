// src/components/Sidebar/Sidebar.js
import React from 'react';
import { FaUser, FaChartLine, FaClipboardList, FaShoppingCart, FaSignOutAlt, FaUsers } from 'react-icons/fa'; // Importar íconos
import './Sidebar.css';

const Sidebar = ({ onButtonClick }) => {
  return (
    <div className="sidebar">
      <div className="profile-section">
        <FaUser size={40} className="icon" /> {/* Ícono de usuario */}
        <p>Usuario: <strong>Nombre de Usuario</strong></p>
      </div>
      <ul className="menu-list">
        <li onClick={() => onButtonClick('dashboard')}>
          <FaChartLine className="icon" /> Dashboard {/* Ícono para el Dashboard */}
        </li>
        <li onClick={() => onButtonClick('producto')}>
          <FaClipboardList className="icon" /> Productos {/* Ícono para Inventario */}
        </li>
        <li onClick={() => onButtonClick('ventas')}>
          <FaShoppingCart className="icon" /> Ventas {/* Ícono de carrito de compras para Ventas */}
        </li>
        <li onClick={() => onButtonClick('empleados')}>  {/* Nuevo ícono para Administración de Empleados */}
          <FaUsers className="icon" /> Empleados {/* Ícono de usuarios para Empleados */}
        </li>
        <li onClick={() => onButtonClick('suppliers')}>  {/* Nuevo ícono para Administración de Empleados */}
          <FaUsers className="icon" /> Proveedores {/* Ícono de usuarios para Empleados */}
        </li>
        <li onClick={() => onButtonClick('salir')}>
          <FaSignOutAlt className="icon" /> Salir {/* Ícono de salida */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

