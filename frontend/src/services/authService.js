import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import config from '../config';  // Asegúrate de que esta importación sea correcta

// Concatenar la URL base de la API de autenticación
const API_AUTH_URL = `${config.API_AUTH_BASE_URL}${config.API_AUTH_PATH}`;
console.log('API_AUTH_URL:', API_AUTH_URL);

export const AuthPort = {
    loginUser: async (email, clave) => {
        try {
            console.log('Datos enviados:', { email, clave });
    
            const response = await fetch(`${API_AUTH_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, clave }),
                credentials: 'include',
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error HTTP:', response.status, errorData.message);
                throw new Error(errorData.message || 'Error al autenticarse.');
            }
    
            const data = await response.json();
            console.log('Datos de respuesta:', data);
    
            const token = data?.data?.accessToken;
            if (token) {
                Cookies.set('jwtToken', token, { expires: 7, sameSite: 'Lax' });
                console.log('Token guardado en la cookie:', token);
                return { success: true, token, ...data.data };
            } else {
                throw new Error('No se recibió un token de acceso.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return { success: false, message: error.message || 'Error de conexión.' };
        }
    }
};
