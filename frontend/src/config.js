const config = {
  // Información de la aplicación
  APP_NAME: process.env.REACT_APP_APP_NAME,
  DEFAULT_ROLE: process.env.REACT_APP_DEFAULT_ROLE,
  AVAILABLE_ROLES: process.env.REACT_APP_AVAILABLE_ROLES
    ? process.env.REACT_APP_AVAILABLE_ROLES.split(',')
    : ['ADMINISTRATOR', 'WAREHOUSE CLERK', 'SELLER'],  // Roles actualizados

  // URLs para Autenticación y Usuarios
  API_AUTH_BASE_URL: process.env.REACT_APP_API_AUTH_BASE_URL,
  API_AUTH_PATH: process.env.REACT_APP_API_AUTH_PATH,
  API_USERS_PATH: process.env.REACT_APP_API_USERS_PATH,

  // URLs para Productos y Categorías
  API_PRODUCTS_BASE_URL: process.env.REACT_APP_API_PRODUCTS_BASE_URL,
  API_PRODUCTS_PATH: process.env.REACT_APP_API_PRODUCTS_PATH,
  API_CATEGORIES_PATH: process.env.REACT_APP_API_CATEGORIES_PATH,

  // URLs para Proveedores
  API_SUPPLIERS_BASE_URL: process.env.REACT_APP_API_SUPPLIERS_BASE_URL,
  API_SUPPLIERS_PATH: process.env.REACT_APP_API_SUPPLIERS_PATH,

  // URLs para Pedidos
  API_ORDERS_BASE_URL: process.env.REACT_APP_API_ORDERS_BASE_URL,
  API_ORDERS_PATH: process.env.REACT_APP_API_ORDERS_PATH,

  // URLs para Empleados
  API_EMPLOYEES_BASE_URL: process.env.REACT_APP_API_EMPLOYEES_BASE_URL,
  API_EMPLOYEES_PATH: process.env.REACT_APP_API_EMPLOYEES_PATH,
};

export default config;
