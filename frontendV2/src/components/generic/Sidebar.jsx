import React from 'react';
import { FaChartLine, FaClipboardList, FaShoppingCart, FaSignOutAlt, FaUsers, FaUser, FaBox } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { getUserRole } from '../../utilities/jwtUtils'; // Importar la función getUserRole
import LogoutModal from './LogoutModal'; // Importar el Modal

const Sidebar = ({ onButtonClick, onLogout }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const location = useLocation();
  const activeSection = location.pathname.replace('/', '') || 'dashboard';

  // Configuración de módulos según el rol
  const modulesByRole = {
    ADMINISTRATOR: [
      { key: 'dashboard', label: 'Dashboard', icon: <FaChartLine className="text-xl text-yellow-400" /> },
      { key: 'pedidos', label: 'Pedidos', icon: <FaBox className="text-xl text-yellow-400" /> },
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="text-xl text-yellow-400" /> },
      { key: 'ventas', label: 'Ventas', icon: <FaShoppingCart className="text-xl text-yellow-400" /> },
      { key: 'empleados', label: 'Empleados', icon: <FaUsers className="text-xl text-yellow-400" /> },
      { key: 'proveedores', label: 'Proveedores', icon: <FaUser className="text-xl text-yellow-400" /> },
    ],
    'WAREHOUSE CLERK': [
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="text-xl text-yellow-400" /> },
      { key: 'pedidos', label: 'Pedidos', icon: <FaBox className="text-xl text-yellow-400" /> },
    ],
    SELLER: [
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="text-xl text-yellow-400" /> },
      { key: 'ventas', label: 'Ventas', icon: <FaShoppingCart className="text-xl text-yellow-400" /> },
    ],
  };

  // Obtener el rol del usuario desde el JWT almacenado en localStorage
  const token = localStorage.getItem('jwt');
  const userRole = token ? getUserRole(token) : 'GUEST'; // Obtener el rol del token
  const normalizedRole = Array.isArray(userRole) ? userRole[0] : userRole.toUpperCase();  // Normaliza el rol
  const allowedModules = modulesByRole[normalizedRole] || []; // Obtener los módulos permitidos para el rol

  const navigate = useNavigate();

  const handleClick = (module) => {
    if (module !== 'salir') {
      console.log(`Navegando a la sección: ${module}`);
      navigate(`/${module}`);  // Navegar a la sección correspondiente
      onButtonClick(module);  // Llamar a onButtonClick para manejar la sección activa
    } else {
      setShowLogoutModal(true); // Mostrar el modal de logout
    }
  };

  return (
    <div
      className={`h-full bg-gray-800 text-white transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ToastContainer />

      <LogoutModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={onLogout} // Llama a la función de logout cuando se confirma
        title="Confirmación de Cierre de Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
      />

      <ul className="space-y-2 mt-5">
        {allowedModules.map((module) => (
          <li
            key={module.key}
            className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-700 ${activeSection === module.key ? 'bg-gray-600' : ''}`}
            onClick={() => handleClick(module.key)}
          >
            {module.icon}
            {isExpanded && <span className="ml-4">{module.label}</span>}
          </li>
        ))}
        <li 
          onClick={() => handleClick('salir')} 
          className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-700"
        >
          <FaSignOutAlt className="text-xl text-yellow-400" />
          {isExpanded && <span className="ml-4">Salir</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
