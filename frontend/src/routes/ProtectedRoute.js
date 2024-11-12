import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthPort } from '../ports/authPort';  // Asegúrate de que la ruta sea correcta

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  const userRole = AuthPort.getRolesFromToken();
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/access-denied" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
