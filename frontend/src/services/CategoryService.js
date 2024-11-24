import config from '../config'; // Ruta al archivo de configuración
import Cookies from 'js-cookie'; // Manejo de cookies para autenticación

const API_CATEGORIES = config.API_CATEGORIES;

// Obtener el token de autenticación desde las cookies
const getToken = () => {
    return Cookies.get('jwtToken');
};

// CategoryService: Encapsula todas las interacciones con la API de categorías
const CategoryService = {
    // Listar categorías
    listCategories: async () => {
        try {
            const token = getToken();
            const response = await fetch(`${API_CATEGORIES}/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al listar categorías: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en listCategories:', error.message);
            throw error;
        }
    },

    // Guardar nueva categoría
    // En el método saveCategory de CategoryService.js
    saveCategory: async (category) => {
        try {
            const token = getToken();
            const response = await fetch(`${API_CATEGORIES}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(category),
            });

            if (!response.ok) {
                const errorDetails = await response.json(); // Captura más detalles del error
                console.error(`Error al guardar la categoría: ${JSON.stringify(errorDetails)}`);
                throw new Error(`Error al guardar la categoría: ${JSON.stringify(errorDetails)}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en saveCategory:', error.message);
            throw error;
        }
    },



    // Actualizar categoría existente
updateCategory: async (id, updatedCategory) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_CATEGORIES}/update/${id}`, { // Verifica que `id` sea un valor correcto
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedCategory),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la categoría: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en updateCategory:', error.message);
        throw error;
    }
},

    // Eliminar categoría
    deleteCategory: async (id) => {
        try {
            const token = getToken();
            const response = await fetch(`${API_CATEGORIES}/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar la categoría: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error en deleteCategory:', error.message);
            throw error;
        }
    },

    // Buscar categoría por ID
    findCategoryById: async (id) => {
        try {
            const token = getToken();
            const response = await fetch(`${API_CATEGORIES}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al buscar categoría por ID: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en findCategoryById:', error.message);
            throw error;
        }
    },
};

export default CategoryService;
