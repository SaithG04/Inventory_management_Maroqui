import axios from "axios";
import Cookies from 'js-cookie';

// Usamos las variables de entorno definidas en el archivo .env
const API_PRODUCTS_BASE_URL = process.env.REACT_APP_API_PRODUCTS_BASE_URL;
const API_AUTH_BASE_URL = process.env.REACT_APP_API_AUTH_BASE_URL;
const API_SUPPLIERS_BASE_URL = process.env.REACT_APP_API_SUPPLIERS_BASE_URL;
const API_ORDERS_BASE_URL = process.env.REACT_APP_API_ORDERS_BASE_URL;
const token = Cookies.get('jwtToken'); 

export const Http = axios.create({
  baseURL: API_PRODUCTS_BASE_URL, // URL base para productos y categorías
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export const AuthHttp = axios.create({
  baseURL: API_AUTH_BASE_URL, // URL base para autenticación
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export const SuppliersHttp = axios.create({
  baseURL: API_SUPPLIERS_BASE_URL, // URL base para proveedores
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});


export const OrdersHttp = axios.create({
  baseURL: API_ORDERS_BASE_URL, // URL base para pedidos
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
