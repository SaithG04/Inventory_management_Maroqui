import axios from "axios";
import Cookies from "js-cookie";

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
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

// Configuración HTTP para productos
export const ProductsHttp = createHttpInstance(
  `${process.env.REACT_APP_API_PRODUCTS_BASE_URL}${process.env.REACT_APP_API_PRODUCTS_PATH}`
);

// Configuración HTTP para categorías
export const CategoriesHttp = createHttpInstance(
  `${process.env.REACT_APP_API_PRODUCTS_BASE_URL}${process.env.REACT_APP_API_CATEGORIES_PATH}`
);

// Configuración HTTP para autenticación
export const AuthHttp = createHttpInstance(process.env.REACT_APP_API_AUTH_BASE_URL);

// Configuración HTTP para proveedores
export const SuppliersHttp = createHttpInstance(
  `${process.env.REACT_APP_API_SUPPLIERS_BASE_URL}${process.env.REACT_APP_API_SUPPLIERS_PATH}`
);

// Configuración HTTP para pedidos
export const OrdersHttp = createHttpInstance(
  `${process.env.REACT_APP_API_ORDERS_BASE_URL}${process.env.REACT_APP_API_ORDERS_PATH}`
);

// Configuración HTTP para empleados
export const EmployeesHttp = createHttpInstance(
  `${process.env.REACT_APP_API_EMPLOYEES_BASE_URL}${process.env.REACT_APP_API_EMPLOYEES_PATH}`
);
