import Cookies from 'js-cookie';  // Importar la librería para manejar cookies
import { jwtDecode } from 'jwt-decode';  // Importar la función para decodificar JWT
import config from '../config';  // Asegúrate de que esta importación sea correcta

// Concatenar la URL base de la API de autenticación usando la configuración proporcionada
const API_AUTH_URL = `${config.API_AUTH_BASE_URL}${config.API_AUTH_PATH}`;
console.log('API_AUTH_URL:', API_AUTH_URL);

export const AuthPort = {
    // Método para iniciar sesión con el email y la contraseña (clave)
    loginUser: async (email, clave) => {
        try {
            // Mostrar los datos enviados para la autenticación
            console.log('Datos enviados:', { email, clave });
    
            // Realizar una solicitud POST a la API de autenticación
            const response = await fetch(`${API_AUTH_URL}/login`, {
                method: 'POST',  // Método de la solicitud es POST
                headers: {
                    'Content-Type': 'application/json',  // Se envía como JSON
                },
                body: JSON.stringify({ email, clave }),  // Datos del cuerpo en formato JSON
                credentials: 'include',  // Incluir las credenciales de la sesión
            });
    
            // Validar si la respuesta es correcta (status HTTP 200-299)
            if (!response.ok) {
                const errorData = await response.json();  // Parsear la respuesta de error
                console.error('Error HTTP:', response.status, errorData.message);  // Mostrar el código de error y mensaje
                throw new Error(errorData.message || 'Error al autenticarse.');  // Lanzar error con mensaje de respuesta o genérico
            }
    
            // Parsear la respuesta JSON cuando la autenticación es exitosa
            const data = await response.json();
            console.log('Datos de respuesta:', data);
    
            // Extraer el token de acceso del cuerpo de la respuesta
            const token = data?.data?.accessToken;
            if (token) {
                // Guardar el token en las cookies con una expiración de 7 días y opción 'Lax' para seguridad
                Cookies.set('jwtToken', token, { expires: 7, sameSite: 'Lax' });
                console.log('Token guardado en la cookie:', token);  // Confirmar que el token fue guardado
                return { success: true, token, ...data.data };  // Devolver el éxito con el token y los datos
            } else {
                // Si no se recibe un token, lanzar un error
                throw new Error('No se recibió un token de acceso.');
            }
        } catch (error) {
            // Manejar cualquier error durante el proceso de autenticación
            console.error('Error en la solicitud:', error);  // Mostrar el error en la consola
            return { success: false, message: error.message || 'Error de conexión.' };  // Retornar el error con mensaje
        }
    }
};
