import React from 'react';
import { FaChartLine, FaClipboardList, FaSignOutAlt, FaUsers, FaUser, FaBox } from 'react-icons/fa'; // Importación de íconos para las secciones del sidebar
import { useNavigate, useLocation } from 'react-router-dom'; // Hooks para navegación y ubicación actual
import './Sidebar.css'; // Estilos específicos para el Sidebar
import 'react-toastify/dist/ReactToastify.css'; // Estilos de react-toastify para notificaciones
import { ToastContainer } from 'react-toastify'; // Contenedor de notificaciones
import Modal from '../../shared/modal/Modal'; // Componente modal para la confirmación de cierre de sesión

// Componente Sidebar, recibe onButtonClick, userRole y onLogout como props
const Sidebar = ({ onButtonClick, userRole = '', onLogout }) => {
  // Estado para manejar la expansión y colapso del sidebar
  const [isExpanded, setIsExpanded] = React.useState(false);
  // Estado para controlar la visibilidad del modal de cierre de sesión
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // Hook de ubicación para sincronizar el estado con la URL actual
  const location = useLocation();
  const activeSection = location.pathname.replace('/', '') || 'dashboard';  // Extrae la sección activa de la URL

  // Configuración de los módulos disponibles según el rol del usuario
  const modulesByRole = {
    ADMINISTRATOR: [
      { key: 'dashboard', label: 'Dashboard', icon: <FaChartLine className="sidebar-icon" /> },
      { key: 'pedidos', label: 'Pedidos', icon: <FaBox className="sidebar-icon" /> },
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
      { key: 'empleados', label: 'Empleados', icon: <FaUsers className="sidebar-icon" /> },
      { key: 'proveedores', label: 'Proveedores', icon: <FaUser className="sidebar-icon" /> },
    ],
    'WAREHOUSE CLERK': [
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
      { key: 'pedidos', label: 'Pedidos', icon: <FaBox className="sidebar-icon" /> },
    ],
    SELLER: [
      { key: 'producto', label: 'Productos', icon: <FaClipboardList className="sidebar-icon" /> },
    ],
  };

  // Normaliza el rol del usuario, convirtiéndolo a mayúsculas
  const normalizedRole = userRole ? userRole.toUpperCase() : 'GUEST';
  // Obtiene los módulos permitidos según el rol del usuario
  const allowedModules = modulesByRole[normalizedRole] || [];

  // Hook para manejar la navegación entre las secciones
  const navigate = useNavigate();

  // Maneja el clic en los elementos del sidebar
  const handleClick = (module) => {
    if (module !== 'salir') {
      navigate(`/${module}`);  // Navega a la sección correspondiente
      onButtonClick(module);  // Llama a onButtonClick para actualizar la sección activa
    } else {
      setShowLogoutModal(true);  // Muestra el modal de confirmación de cierre de sesión
    }
  };

  return (
    <div
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`} // Aplica clases CSS para expansión o colapso
      onMouseEnter={() => setIsExpanded(true)} // Expande el sidebar cuando el mouse entra
      onMouseLeave={() => setIsExpanded(false)} // Colapsa el sidebar cuando el mouse sale
    >
      <ToastContainer />  {/*Contenedor de notificaciones*/}

      {/* Modal para la confirmación de cierre de sesión */}
      <Modal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}  // Cierra el modal
        onConfirm={onLogout}  // Llama a la función de cierre de sesión cuando se confirma
        title="Confirmación de Cierre de Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
      />

      {/* Lista de módulos del sidebar */}
      <ul className="menu-list">
        {allowedModules.map((module) => (
          <li
            key={module.key}
            className={activeSection === module.key ? 'active' : ''}  // Marca el módulo activo según la URL
            onClick={() => handleClick(module.key)}  // Maneja el clic en el módulo
          >
            {module.icon} {isExpanded && <span>{module.label}</span>}  {/* Muestra el icono y el nombre del módulo si el sidebar está expandido */}
          </li>
        ))}
        {/* Elemento de cierre de sesión */}
        <li onClick={() => handleClick('salir')} className="logout-button">
          <FaSignOutAlt className="sidebar-icon" /> {isExpanded && <span>Salir</span>}  {/* Muestra el botón de salida */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
