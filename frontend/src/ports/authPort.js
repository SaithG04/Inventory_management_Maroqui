import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import config from '../config'; // Importar el archivo de configuración centralizada

// Definimos la URL base de la API a partir del archivo de configuración
const API_AUTH = config.API_AUTH_BASE_URL+config.API_AUTH_PATH; // Usamos la variable correcta

// Objeto `AuthPort` que contiene las funciones para interactuar con la API de autenticación
export const AuthPort = {
  // Función para iniciar sesión
  loginUser: async (email, clave) => {
    try {
      // Realizar una solicitud HTTP POST a la API de inicio de sesión
      console.log('Datos enviados:', { email, clave });
      const response = await fetch(`${API_AUTH}/login`, { // Usa la URL base desde config
        method: 'POST', // Método POST para enviar credenciales
        headers: {
          'Content-Type': 'application/json', // Especificamos el tipo de contenido como JSON
        },
        body: JSON.stringify({ email, clave }), // Convertimos las credenciales a un formato JSON
        credentials: 'include', // Incluir cookies para manejar sesiones
      });

      // Verificar si la respuesta es correcta (status code 200)
      if (!response.ok) {
        // Dependiendo del código de estado, devolvemos un mensaje de error específico
        const errorMessages = {
          401: 'No autorizado. Credenciales inválidas.', // Código 401: No autorizado
          403: 'Prohibido. No tienes acceso a este recurso.', // Código 403: Prohibido
          500: 'Error interno del servidor. Intenta nuevamente más tarde.' // Código 500: Error interno del servidor
        };
        
        const message = errorMessages[response.status] || 'Error desconocido.';
        return { success: false, message };
      }

      // Parsear la respuesta JSON del servidor
      const data = await response.json();

      // Verificar si la respuesta contiene un token de autenticación
      if (data.data && data.data.accessToken) {
        const token = data.data.accessToken;

        // Guardar el token en cookies con una expiración de 1 día
        Cookies.set('jwtToken', token, { expires: 1, sameSite: 'Lax' });

        // Decodificar el token JWT para extraer información del usuario
        const decodedToken = jwtDecode(token);

        // Retornar el resultado exitoso de la autenticación
        return { success: true, email: decodedToken.email, role: decodedToken.roles, message: 'Autenticación exitosa' };
      } else {
        // Si no se encuentra un token en la respuesta, retornamos un error de autenticación
        return { success: false, message: data.message || 'Error de autenticación' };
      }
    } catch (error) {
      // Manejar errores de conexión con el servidor
      console.error('Error de conexión:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  },
};
