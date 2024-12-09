import React from 'react';
import { FaChartLine, FaClipboardList, FaShoppingCart, FaSignOutAlt, FaUsers, FaUser, FaBox } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';  
import './Sidebar.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Modal from '../../shared/modal/Modal';

const Sidebar = ({ onButtonClick, userRole = '', onLogout }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // Use location to sync with current active section based on URL
  const location = useLocation();
  const activeSection = location.pathname.replace('/', '') || 'dashboard';  // Extract active section from URL

  // Configuración de módulos según el rol
  const modulesByRole = {
    ADMINISTRATOR: [
      { key: 'dashboard', label: 'Dashboard', icon: <FaChartLine className="sidebar-icon" /> },
      { key: 'pedidos', label: 'Pedidos', icon: <FaBox className="sidebar-icon" /> },
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
      { key: 'ventas', label: 'Ventas', icon: <FaShoppingCart className="sidebar-icon" /> },
      { key: 'empleados', label: 'Empleados', icon: <FaUsers className="sidebar-icon" /> },
      { key: 'proveedores', label: 'Proveedores', icon: <FaUser className="sidebar-icon" /> },
    ],
    'WAREHOUSE CLERK': [
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
      { key: 'pedidos', label: 'Pedidos', icon: <FaBox className="sidebar-icon" /> },
    ],
    SELLER: [
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
      { key: 'ventas', label: 'Ventas', icon: <FaShoppingCart className="sidebar-icon" /> },
    ],
  };

  const normalizedRole = userRole ? userRole.toUpperCase() : 'GUEST';
  const allowedModules = modulesByRole[normalizedRole] || [];

  const navigate = useNavigate();

  const handleClick = (module) => {
    if (module !== 'salir') {
      console.log(`Navegando a la sección: ${module}`);
      navigate(`/${module}`);  // Navegar a la sección correspondiente
      onButtonClick(module);  // Llamar a onButtonClick para manejar la sección activa
    } else {
      setShowLogoutModal(true);
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
