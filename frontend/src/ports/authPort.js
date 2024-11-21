// Importamos las dependencias necesarias
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import config from '../config'; // Importar el archivo de configuración centralizada

// Definimos la URL base de la API a partir del archivo de configuración
const API_URL = config.API_URL;

// Objeto `AuthPort` que contiene las funciones para interactuar con la API de autenticación
export const AuthPort = {
  // Función para iniciar sesión
  loginUser: async (email, clave) => {
    try {
      // Realizar una solicitud HTTP POST a la API de inicio de sesión
      const response = await fetch(`${API_URL}/api/auth/login`, { // Usa la URL base desde config
        method: 'POST', // Método POST para enviar credenciales
        headers: {
          'Content-Type': 'application/json', // Especificamos el tipo de contenido como JSON
        },
        body: JSON.stringify({ email, clave }), // Convertimos las credenciales a un formato JSON
        credentials: 'include', // Incluir cookies para manejar sesiones
      });

      // Log de la respuesta del servidor para depuración
      console.log('Respuesta del servidor:', response);

      // Verificar si la respuesta es correcta (status code 200)
      if (!response.ok) {
        // Dependiendo del código de estado, devolvemos un mensaje de error específico
        if (response.status === 401) {
          return { success: false, message: 'No autorizado. Credenciales inválidas.' }; // Código 401: No autorizado
        } else if (response.status === 403) {
          return { success: false, message: 'Prohibido. No tienes acceso a este recurso.' }; // Código 403: Prohibido
        } else if (response.status === 500) {
          return { success: false, message: 'Error interno del servidor. Intenta nuevamente más tarde.' }; // Código 500: Error interno del servidor
        } else {
          return { success: false, message: 'Error desconocido.' }; // Otros errores desconocidos
        }
      }

      // Parsear la respuesta JSON del servidor
      const data = await response.json();

      // Verificar si la respuesta contiene un token de autenticación
      if (data.data && data.data.token) {
        const token = data.data.token;

        // Guardar el token en cookies con una expiración de 1 día
        Cookies.set('jwtToken', token, { expires: 1, sameSite: 'Lax' });
        console.log('Token guardado en cookies:', Cookies.get('jwtToken'));

        // Decodificar el token JWT para extraer información del usuario
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken); // Log del token decodificado para depurar

        // Si el token se decodifica correctamente, logueamos la información del usuario
        if (decodedToken) {
          console.log('Roles desde el token:', decodedToken.roles);
          console.log('Usuario autenticado:', decodedToken.email);
        }

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
