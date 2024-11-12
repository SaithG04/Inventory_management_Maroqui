import Cookies from 'js-cookie';

export const AuthPort = {
  loginUser: async (email, clave) => {
    try {
      const response = await fetch('https://deciding-sacred-antelope.ngrok-free.app/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, clave }),
        credentials: 'include', // Si necesitas enviar credenciales (cookies)
      });

      if (!response.ok) {
        return { success: false, message: 'Error de autenticación' };
      }

      const data = await response.json();

      if (data.data && data.data.token) {
        // Guardamos el token en una cookie
        Cookies.set('jwtToken', data.data.token, { expires: 1, secure: true, sameSite: 'Strict' });

        // Devolvemos el estado de autenticación y el rol del usuario
        return { success: true, email: data.data.email, role: data.data.role, message: 'Autenticación exitosa' };
      } else {
        return { success: false, message: data.message || 'Error de autenticación' };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  }
};
