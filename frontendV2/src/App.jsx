import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Componentes
//UIS
//===============================================
//UI LOGIN
import Home from './ui/Home';
//===============================================
//UIADMINISTRADOR
import AdminUI from './ui/adminUI/AdminUI';

//===============================================
//===============================================
//UIVENDEDOR
import Ventas from './ui/vendedorUI/Ventas';

//===============================================
//===============================================
//UIALMAENERO
import AlmaceneroUI from './ui/almacenetoUI/AlmaceneroUI';

//===============================================

//utilities
//===============================================
import ProtectedRouteHome from './utilities/ProtectedRouteHome'; // Importar el componente ProtectedRoute

import ProtectedRouteRol from './utilities/ProtectedRouteRol';
//===============================================


function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Rutas protegidas para rol ADMINISTRADOR */}
      <Route path="/adminui" element={<ProtectedRouteRol element={<AdminUI />} allowedRoles={['ADMINISTRATOR']} />} />

       {/* Rutas protegidas para rol SELLER */}
       <Route path="/ventas" element={<ProtectedRouteRol element={<Ventas />} allowedRoles={['SELLER']} />} />

      {/* Rutas protegidas para rol WAREHOUSE CLERK */}
      <Route path="/AlmaceneroUI" element={<ProtectedRouteRol element={<AlmaceneroUI />} allowedRoles={['WAREHOUSE CLERK']} />} />

      {/* Ruta no definida - Redirigir a la página principal */}
      <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirige a '/' */}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;