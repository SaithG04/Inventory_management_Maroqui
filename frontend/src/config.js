// src/config.js

const config = {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080', // Dirección de la API
    APP_NAME: process.env.REACT_APP_APP_NAME || 'MiAplicacion', // Nombre de la aplicación
    DEFAULT_ROLE: process.env.REACT_APP_DEFAULT_ROLE || 'User', // Rol predeterminado
    AVAILABLE_ROLES: process.env.REACT_APP_AVAILABLE_ROLES ? process.env.REACT_APP_AVAILABLE_ROLES.split(',') : ['Administrator', 'Vendedor', 'Almacenero'], // Roles disponibles
  };
  
  export default config;