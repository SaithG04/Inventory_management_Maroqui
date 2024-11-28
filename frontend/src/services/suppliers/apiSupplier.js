import { getToken } from '../../utils/jwt'; // Manejo del token desde cookies

const ApiSupplier = async (url, method = 'GET', body = null) => {
    try {
        const token = getToken(); // Obtiene el token desde cookies
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agrega el token en el header
            },
        };

        if (body) {
            options.body = JSON.stringify(body); // Cuerpo de la petición
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || `Error: ${response.statusText}`);
        }

        return await response.json(); // Devuelve la respuesta JSON
    } catch (error) {
        console.error(`Error en ApiSupplier (${method} ${url}):`, error.message);
        throw error;
    }
};

export default ApiSupplier;
