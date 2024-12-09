import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import Sidebar from '../../components/generic/Sidebar'; // Importar Sidebar

function AlmaceneroUI() {
  const navigate = useNavigate(); // Hook para redirigir al usuario

  const handleLogout = () => {
    // Eliminar el token de localStorage
    localStorage.removeItem('jwt');
    // Redirigir a la página de inicio
    navigate('/');
  };

  return (
    <div className="flex h-screen"> {/* Aseguramos que el contenedor ocupe toda la altura */}
      {/* Sidebar del Admin */}
      <Sidebar onButtonClick={() => {}} onLogout={handleLogout} />

      {/* Contenido principal */}
      <div className="flex-1 bg-gradient-to-r from-green-200 to-blue-400 min-h-screen p-8">
        <div className="bg-white shadow-lg rounded-lg p-12 w-full sm:w-3/4 max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8">Panel de Almacenero</h2>
          <p className="text-lg text-gray-700 mb-6">Bienvenido al panel de Almacenero de Librería Hiroqui.</p>
          
          {/* Botón de Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlmaceneroUI;
