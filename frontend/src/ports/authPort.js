// src/ports/authPort.js

// Simulación de la autenticación de usuario
export const AuthPort = {
    loginUser: async (email, password) => {
        // Simula que el único usuario válido es 'user@miroqui.es'
        const validUser = 'user@miroqui.es';

        // Verifica si el correo termina en @miroqui.es (formato correcto)
        if (!email.endsWith('@miroqui.es')) {
            return {
                success: false,
                message: 'Formato de correo incorrecto',
            };
        }

        // Verifica si el usuario existe en el sistema
        if (email !== validUser) {
            return {
                success: false,
                message: 'Usuario no registrado. Verifique su correo.',
            };
        }

        // Simula la validación de la contraseña para un usuario existente
        if (password === 'password123') {
            return {
                success: true,
                message: 'Autenticación exitosa',
            };
        } else {
            return {
                success: false,
                message: 'Credenciales inválidas.',
            };
        }
    }
};
