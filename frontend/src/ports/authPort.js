// AuthPort.js
import { jwtDecode } from 'jwt-decode'; // Usa una exportación con nombre en lugar de una exportación por defecto
import Cookies from 'js-cookie';

export const AuthPort = {
  loginUser: async (email, clave) => {
    try {
      const response = await fetch('http://10.8.0.1:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, clave }),
        credentials: 'include', // Para manejar cookies
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, message: 'No autorizado. Credenciales inválidas.' };
        } else if (response.status === 403) {
          return { success: false, message: 'Prohibido. No tienes acceso a este recurso.' };
        } else if (response.status === 500) {
          return { success: false, message: 'Error interno del servidor. Intenta nuevamente más tarde.' };
        } else {
          return { success: false, message: 'Error desconocido.' };
        }
      }

      const data = await response.json();

      if (data.data && data.data.token) {
        const token = data.data.token;

        // Cambiar configuración de la cookie
        Cookies.set('jwtToken', token, { expires: 1, sameSite: 'Lax' }); // Quitar `secure: true` para entorno de pruebas HTTP
        console.log("Token guardado en cookies:", Cookies.get('jwtToken')); // Verificar si se almacena correctamente

        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        return { success: true, email: decodedToken.email, role: decodedToken.roles, message: 'Autenticación exitosa' };
      } else {
        return { success: false, message: data.message || 'Error de autenticación' };
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  }
};
