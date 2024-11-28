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

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            // Si no es exitosa, intentar obtener el mensaje de error
            const errorText = await response.text(); // Usar text() si no es JSON
            throw new Error(errorText || `Error: ${response.statusText}`);
        }

        // Si la respuesta tiene contenido, intentar parsearlo como JSON
        const responseBody = await response.text(); // Obtener el cuerpo como texto
        if (responseBody) {
            return JSON.parse(responseBody); // Si hay contenido, parsearlo como JSON
        } else {
            return {}; // Si no hay contenido, retornar un objeto vacío
        }

    } catch (error) {
        console.error(`Error en ApiProduct (${method} ${url}):`, error.message);
        throw error;
    }
};

export default ApiProduct;
