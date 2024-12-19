import { getToken } from '../../utils/jwt'; // Ahora usa cookies para el token

const ApiCategory = async (url, method = 'GET', body = null) => {
    try {
        const token = getToken(); // Obtiene el token desde cookies
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agrega el token al header
            },
        };

        if (body) {
            options.body = JSON.stringify(body); // Convierte el cuerpo a JSON si existe
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || `Error: ${response.statusText}`);
        }

        return await response.json(); // Devuelve la respuesta en JSON
    } catch (error) {
        console.error(`Error en ApiCategory (${method} ${url}):`, error.message);
        throw error;
    }
};

export default ApiCategory;
