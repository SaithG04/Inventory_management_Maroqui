import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const AuthPort = {
  loginUser: async (email, clave) => {
    try {
      const response = await fetch('https://deciding-sacred-antelope.ngrok-free.app/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, clave }),
        credentials: 'include', // Para manejar cookies
      });

      if (!response.ok) {
        return { success: false, message: 'Error de autenticación' };
      }

      const data = await response.json();

      if (data.data && data.data.token) {
        // Guardamos el token en una cookie
        const token = data.data.token;
        Cookies.set('jwtToken', token, { expires: 1, secure: true, sameSite: 'Strict' });

        // Decodificamos el token
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Para verificar el contenido del token

        // Puedes acceder a los datos decodificados del token, como nombre, roles, etc.
        return { success: true, email: decodedToken.email, role: decodedToken.roles, message: 'Autenticación exitosa' };
      } else {
        return { success: false, message: data.message || 'Error de autenticación' };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  }
};
