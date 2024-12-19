import axios from "axios";
import Cookies from "js-cookie";

// Usamos las variables de entorno definidas en el archivo .env
const API_PRODUCTS_BASE_URL = process.env.REACT_APP_API_PRODUCTS_BASE_URL;
const API_AUTH_BASE_URL = process.env.REACT_APP_API_AUTH_BASE_URL;
const API_SUPPLIERS_BASE_URL = process.env.REACT_APP_API_SUPPLIERS_BASE_URL;
const API_ORDERS_BASE_URL = process.env.REACT_APP_API_ORDERS_BASE_URL;
const API_EMPLOYEES_BASE_URL = process.env.REACT_APP_API_EMPLOYEES_BASE_URL;

const APP_API_SUPPLIERS_PATH = process.env.REACT_APP_API_SUPPLIERS_PATH;
const APP_API_EMPLOYEES_PATH = process.env.REACT_APP_API_EMPLOYEES_PATH;

const token = Cookies.get("jwtToken"); // Token JWT almacenado en las cookies

// Configuración HTTP para productos
export const Http = axios.create({
  baseURL: API_PRODUCTS_BASE_URL, // URL base para productos y categorías
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Configuración HTTP para autenticación
export const AuthHttp = axios.create({
  baseURL: API_AUTH_BASE_URL, // URL base para autenticación
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Configuración HTTP para proveedores
export const SuppliersHttp = axios.create({
  baseURL: `${API_SUPPLIERS_BASE_URL}${APP_API_SUPPLIERS_PATH}`, // Concatenar la URL base para proveedores con el path
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Configuración HTTP para pedidos
export const OrdersHttp = axios.create({
  baseURL: API_ORDERS_BASE_URL, // URL base para pedidos
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Configuración HTTP para empleados
export const EmployeesHttp = axios.create({
  baseURL: `${API_EMPLOYEES_BASE_URL}${APP_API_EMPLOYEES_PATH}`, // Concatenar la URL base para empleados con el path
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
