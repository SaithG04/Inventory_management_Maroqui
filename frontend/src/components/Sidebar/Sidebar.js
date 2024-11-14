import React, { useState } from 'react';
import {
  FaChartLine,
  FaClipboardList,
  FaShoppingCart,
  FaSignOutAlt,
  FaUsers,
  FaUser,
  FaBox,
} from 'react-icons/fa';
import './Sidebar.css';
import '../Modal/Modal.css'; // Ajustar la ruta según la estructura de carpetas
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Modal from '../Modal/Modal';

const Sidebar = ({ onButtonClick, userRole, userName, onLogout }) => {
  const [activeModule, setActiveModule] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const modulesByRole = {
    Administrator: [
      { key: 'dashboard', label: 'Dashboard', icon: <FaChartLine className="sidebar-icon" /> },
      { key: 'pedidos', label: 'Pedidos', icon: <FaBox className="sidebar-icon" /> },
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
      { key: 'ventas', label: 'Ventas', icon: <FaShoppingCart className="sidebar-icon" /> },
      { key: 'empleados', label: 'Empleados', icon: <FaUsers className="sidebar-icon" /> },
      { key: 'suppliers', label: 'Proveedores', icon: <FaUser className="sidebar-icon" /> },
    ],
    Almacenero: [
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
    ],
    Vendedor: [
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
      { key: 'ventas', label: 'Ventas', icon: <FaShoppingCart className="sidebar-icon" /> },
    ],
  };

  const normalizedRole =
    userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
  const allowedModules = modulesByRole[normalizedRole] || [];

  const handleClick = (module) => {
    if (module === 'salir') {
      setShowLogoutModal(true);
      console.log('Logout modal should be visible:', showLogoutModal);
    } else {
      setActiveModule(module);
      onButtonClick(module);
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    console.log('User confirmed logout');
    if (typeof onLogout === 'function') {
      onLogout(); // Aquí puedes redirigir al login o limpiar el estado del usuario
    } else {
      console.error('onLogout is not a function');
    }
  };

  return (
    <div
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ToastContainer />
      <Modal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
      <div className="profile-section">
        <div className="user-info">
          <FaUser className="user-icon" />
          <p>
            Usuario: <strong className="user-role">{userRole}</strong>
          </p>
        </div>
        <div className="user-name-container">
          <p>Nombre:</p>
          <span className="user-name">{userName}</span>
        </div>
      </div>

      <ul className="menu-list">
        {allowedModules.map((module) => (
          <li
            key={module.key}
            className={activeModule === module.key ? 'active' : ''}
            onClick={() => handleClick(module.key)}
          >
            {module.icon} {isExpanded && <span>{module.label}</span>}
          </li>
        ))}
        <li onClick={() => handleClick('salir')} className="logout-button">
          <FaSignOutAlt className="sidebar-icon" /> {isExpanded && <span>Salir</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;