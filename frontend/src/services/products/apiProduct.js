import { getToken } from '../../utils/jwt'; // Ahora usará el token desde cookies

const ApiProduct = async (url, method = 'GET', body = null) => {
    try {
        const token = getToken(); // Obtiene el token desde cookies
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Adjunta el token al header
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
        console.error(`Error en ApiProduct (${method} ${url}):`, error.message);
        throw error;
    }
};

export default ApiProduct;
