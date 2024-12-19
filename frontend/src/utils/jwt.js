import Cookies from 'js-cookie'; // Manejo de cookies para el token

// Obtiene el token desde las cookies
export const getToken = () => {
    return Cookies.get('jwtToken'); // Cambia 'jwtToken' si usas otra clave en tus cookies
};

// Obtiene roles desde el token
export const getRolesFromToken = () => {
    const token = getToken();
    if (token) {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload del JWT
            return decodedToken.roles || [];
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return [];
        }
    }
    return [];
};

// Elimina el token (para cierre de sesión)
export const removeToken = () => {
    Cookies.remove('jwtToken');
};
