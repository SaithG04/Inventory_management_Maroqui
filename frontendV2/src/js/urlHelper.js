// src/js/urlHelper.js
const API_BASE_URL = 'http://10.8.0.1'; // Base URL común

export const API_AUTH_URL = `${API_BASE_URL}:8080/api/auth`; // Autenticación y Usuarios
export const API_USERS_URL = `${API_BASE_URL}:8080/api/users`;

export const API_PRODUCTS_URL = `${API_BASE_URL}:8081/api/product`; // Productos
export const API_CATEGORIES_URL = `${API_BASE_URL}:8081/api/category`;

export const API_SUPPLIERS_URL = `${API_BASE_URL}:8082/api/supplier`; // Proveedores

export const API_ORDERS_URL = `${API_BASE_URL}:8083/api/order`; // Pedidos

export const API_EMPLOYEES_URL = `${API_BASE_URL}:8084/api/employee`; // Empleados

export default API_BASE_URL;


