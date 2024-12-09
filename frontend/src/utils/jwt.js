import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

export const getToken = () => {
  const token = Cookies.get('jwtToken');
  console.log('Token guardado:', token);
  return token;
};

export const getRolesFromToken = () => {
  const token = getToken();
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Decodifica el token de forma segura
      return decodedToken.roles || [];
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return [];
    }
  }
  return [];
};

export const removeToken = () => {
  Cookies.remove('jwtToken');
  console.log('Token eliminado');
};
