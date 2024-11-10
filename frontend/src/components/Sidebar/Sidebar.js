import React, { useState } from 'react';
import { FaChartLine, FaClipboardList, FaShoppingCart, FaSignOutAlt, FaUsers, FaUser } from 'react-icons/fa'; // Agregamos FaUser aquí
import './Sidebar.css';

const Sidebar = ({ onButtonClick, userRole, userName }) => {
  const [activeModule, setActiveModule] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const modulesByRole = {
    Administrador: ['dashboard', 'producto', 'ventas', 'empleados', 'suppliers'],
    Almacenero: ['producto'],
    Vendedor: ['producto', 'ventas']
  };

  const allowedModules = modulesByRole[userRole] || [];

  const handleClick = (module) => {
    setActiveModule(module);
    onButtonClick(module);
  };

  return (
    <div
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="profile-section">
        <div className="user-info">
          <FaUser className="user-icon" /> {/* Aquí usamos el ícono de usuario */}
          <p>Usuario: <strong className="user-role">{userRole}</strong></p>
          </div>
        <div className="user-name-container">
          <p>Nombre:</p>
          <span className="user-name">{userName}</span>
        </div>
      </div>

      <ul className="menu-list">
        {allowedModules.includes('dashboard') && (
          <li
            className={activeModule === 'dashboard' ? 'active' : ''}
            onClick={() => handleClick('dashboard')}
          >
            <FaChartLine className="icon" /> {isExpanded && <span>Dashboard</span>}
          </li>
        )}
        {allowedModules.includes('producto') && (
          <li
            className={activeModule === 'producto' ? 'active' : ''}
            onClick={() => handleClick('producto')}
          >
            <FaClipboardList className="icon" /> {isExpanded && <span>Productos</span>}
          </li>
        )}
        {allowedModules.includes('ventas') && (
          <li
            className={activeModule === 'ventas' ? 'active' : ''}
            onClick={() => handleClick('ventas')}
          >
            <FaShoppingCart className="icon" /> {isExpanded && <span>Ventas</span>}
          </li>
        )}
        {allowedModules.includes('empleados') && (
          <li
            className={activeModule === 'empleados' ? 'active' : ''}
            onClick={() => handleClick('empleados')}
          >
            <FaUsers className="icon" /> {isExpanded && <span>Empleados</span>}
          </li>
        )}
        {allowedModules.includes('suppliers') && (
          <li
            className={activeModule === 'suppliers' ? 'active' : ''}
            onClick={() => handleClick('suppliers')}
          >
            <FaUsers className="icon" /> {isExpanded && <span>Proveedores</span>}
          </li>
        )}
        <li onClick={() => handleClick('salir')} className="logout-button">
          <FaSignOutAlt className="icon" /> {isExpanded && <span>Salir</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
