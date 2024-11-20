import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Obtenemos los roles disponibles desde las variables de entorno
const availableRoles = process.env.REACT_APP_AVAILABLE_ROLES
  ? process.env.REACT_APP_AVAILABLE_ROLES.split(',')
  : [];

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const token = Cookies.get('jwtToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  let userRole;
  try {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.roles; // Asegúrate de que el token incluya `roles`
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return <Navigate to="/login" />;
  }

  // Verificar que el rol del usuario está permitido y es válido
  if (!allowedRoles.includes(userRole) || !availableRoles.includes(userRole)) {
    return <Navigate to="/access-denied" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
