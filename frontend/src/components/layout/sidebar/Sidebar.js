import React from 'react';
import { FaChartLine, FaClipboardList, FaShoppingCart, FaSignOutAlt, FaUsers, FaUser, FaBox } from 'react-icons/fa';
import './Sidebar.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Modal from '../../shared/modal/Modal';

const Sidebar = ({ onButtonClick, userRole = '', userName = '', activeSection, onLogout }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const modulesByRole = {
    Administrator: [
      { key: 'dashboard', label: 'Dashboard', icon: <FaChartLine className="sidebar-icon" /> },
      { key: 'pedidos', label: 'Pedidos', icon: <FaBox className="sidebar-icon" /> },
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
      { key: 'ventas', label: 'Ventas', icon: <FaShoppingCart className="sidebar-icon" /> },
      { key: 'empleados', label: 'Empleados', icon: <FaUsers className="sidebar-icon" /> },
      { key: 'suppliers', label: 'Proveedores', icon: <FaUser className="sidebar-icon" /> },
    ],
    Almacenero: [{ key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> }],
    Vendedor: [
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
      { key: 'ventas', label: 'Ventas', icon: <FaShoppingCart className="sidebar-icon" /> },
    ],
  };

  const normalizedRole = userRole
    ? userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase()
    : 'Guest';
  const allowedModules = modulesByRole[normalizedRole] || [];

  const handleClick = (module) => {
    if (module === 'salir') {
      setShowLogoutModal(true);
    } else {
      onButtonClick(module);
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
        onConfirm={onLogout}
        title="Confirmación de Cierre de Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
      />

      <div className="profile-section">
        <div className="user-info">
          <FaUser className="user-icon" />
          <p>Usuario: <strong className="user-role">{userRole}</strong></p>
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
            className={activeSection === module.key ? 'active' : ''}
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
