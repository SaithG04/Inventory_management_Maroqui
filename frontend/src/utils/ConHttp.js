// http.js

import axios from "axios";
import Cookies from "js-cookie";
import config from "../config"; // Importamos el archivo de configuración

// Función para obtener el token dinámicamente
const getToken = () => Cookies.get("jwtToken");

// Configuración base para Axios con un interceptor para manejar el token
const createHttpInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Interceptor para agregar el token dinámicamente
  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error) // Maneja errores de configuración
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        Cookies.remove('jwtToken'); // Remueve el token si es inválido
      }
      return Promise.reject(error); // Maneja otros errores
    }
  );

  return instance;
};

// Configuración HTTP para productos
export const ProductsHttp = createHttpInstance(
  `${config.API_PRODUCTS_BASE_URL}${config.API_PRODUCTS_PATH}`
);

// Configuración HTTP para categorías
export const CategoriesHttp = createHttpInstance(
  `${config.API_PRODUCTS_BASE_URL}${config.API_CATEGORIES_PATH}`
);

// Configuración HTTP para autenticación
export const AuthHttp = createHttpInstance(config.API_AUTH_BASE_URL);

// Configuración HTTP para proveedores
export const SuppliersHttp = createHttpInstance(
  `${config.API_SUPPLIERS_BASE_URL}${config.API_SUPPLIERS_PATH}`
);

// Configuración HTTP para pedidos
export const OrdersHttp = createHttpInstance(
  `${config.API_ORDERS_BASE_URL}${config.API_ORDERS_PATH}`
);

// Configuración HTTP para empleados
export const EmployeesHttp = createHttpInstance(
  `${config.API_EMPLOYEES_BASE_URL}${config.API_EMPLOYEES_PATH}`
);

