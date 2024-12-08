import axios from "axios";
import Cookies from "js-cookie";

// Cargar variables de entorno desde .env
const API_PRODUCTS_BASE_URL = process.env.REACT_APP_API_PRODUCTS_BASE_URL;
const API_CATEGORIES_BASE_URL = `${API_PRODUCTS_BASE_URL}${process.env.REACT_APP_API_CATEGORIES_PATH}`;
const API_AUTH_BASE_URL = process.env.REACT_APP_API_AUTH_BASE_URL;
const API_SUPPLIERS_BASE_URL = process.env.REACT_APP_API_SUPPLIERS_BASE_URL;
const API_ORDERS_BASE_URL = process.env.REACT_APP_API_ORDERS_BASE_URL;
const API_EMPLOYEES_BASE_URL = process.env.REACT_APP_API_EMPLOYEES_BASE_URL;

const token = Cookies.get("jwtToken"); // Obtener el token JWT almacenado en las cookies

// Configuración HTTP para productos
export const ProductsHttp = axios.create({
  baseURL: `${API_PRODUCTS_BASE_URL}${process.env.REACT_APP_API_PRODUCTS_PATH}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Configuración HTTP para categorías
export const CategoriesHttp = axios.create({
  baseURL: API_CATEGORIES_BASE_URL, // Concatenación de productos + categoría
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Configuración HTTP para autenticación
export const AuthHttp = axios.create({
  baseURL: API_AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Configuración HTTP para proveedores
export const SuppliersHttp = axios.create({
  baseURL: `${API_SUPPLIERS_BASE_URL}${process.env.REACT_APP_API_SUPPLIERS_PATH}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Configuración HTTP para pedidos
export const OrdersHttp = axios.create({
  baseURL: `${API_ORDERS_BASE_URL}${process.env.REACT_APP_API_ORDERS_PATH}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Configuración HTTP para empleados
export const EmployeesHttp = axios.create({
  baseURL: `${API_EMPLOYEES_BASE_URL}${process.env.REACT_APP_API_EMPLOYEES_PATH}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
