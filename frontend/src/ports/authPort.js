import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL; // Usamos la URL desde .env

export const AuthPort = {
  loginUser: async (email, clave) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, { // Usa la variable de entorno
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

        Cookies.set('jwtToken', token, { expires: 1, sameSite: 'Lax' });
        console.log("Token guardado en cookies:", Cookies.get('jwtToken'));

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
  },
};
