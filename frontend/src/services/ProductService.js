// ProductService.js
import config from '../config'; // Lo mismo aquí
import Cookies from 'js-cookie'; // Para manejar las cookies de autenticación

// Definimos la URL base de productos desde la configuración
const API_PRODUCTS = config.API_PRODUCTS;

// Función para obtener el token de autenticación desde las cookies
const getToken = () => {
  return Cookies.get('jwtToken');
};

// ProductService: Encapsula todas las interacciones con la API de productos
const ProductService = {
  // Obtener lista de productos
  listProducts: async (page = 0, size = 15) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_PRODUCTS}/listProducts?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al listar productos: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en listProducts:', error.message);
      throw error;
    }
  },

  // Guardar un nuevo producto
  saveProduct: async (product) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_PRODUCTS}/saveProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`Error al guardar el producto: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en saveProduct:', error.message);
      throw error;
    }
  },

  // Actualizar un producto existente
  updateProduct: async (id, product) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_PRODUCTS}/updateProduct/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar el producto: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateProduct:', error.message);
      throw error;
    }
  },

  // Eliminar un producto
  deleteProduct: async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_PRODUCTS}/deleteProduct/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el producto: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error en deleteProduct:', error.message);
      throw error;
    }
  },

  // Buscar un producto por ID
  findProductById: async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_PRODUCTS}/findProductById/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al buscar producto por ID: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en findProductById:', error.message);
      throw error;
    }
  },

  // Buscar productos por estado
  findByStatus: async (status, page = 0, size = 15) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_PRODUCTS}/findByStatus?status=${status}&page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al buscar productos por estado: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en findByStatus:', error.message);
      throw error;
    }
  },

  // Buscar productos por nombre
  findByName: async (name, page = 0, size = 15) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_PRODUCTS}/findByName?name=${name}&page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al buscar productos por nombre: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en findByName:', error.message);
      throw error;
    }
  },
};

export default ProductService;
