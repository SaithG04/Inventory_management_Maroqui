import Cookies from 'js-cookie';
import { AuthHttp } from '../utils/ConHttp'

export const AuthPort = {
    loginUser: async (email, clave) => {
        try {
        
            const credentials = JSON.stringify({ email, clave });
            const response = await AuthHttp.post("login", credentials);
                
            const data = response.data;
        
            if (data?.status === 'success') {
                const accessToken = data?.data?.accessToken;
                const refreshToken = data?.data?.refreshToken;
        
                if (accessToken && refreshToken) {
                    Cookies.set('jwtToken', accessToken, { expires: 7, sameSite: 'Lax' });
                    Cookies.set('jwtRefToken', refreshToken, { expires: 7, sameSite: 'Lax' });
        
        
                    return { success: true, token: accessToken, ...data.data };
                } else {
                    throw new Error('No se recibió tokens de acceso.');
                }
            } else {
                throw new Error('Autenticación fallida.');
            }
        } catch (error) {
            return { success: false, message: error.message || 'Error de conexión.' };
        }        
    }
};
