// src/adapters/loginAdapter.js
import { AuthPort } from '../ports/authPort';

// Función para validar el formato del correo
const validateEmailDomain = (email) => {
    return email.endsWith('@miroqui.es');
};

// Adaptador de login que interactúa con AuthPort
export const loginAdapter = async (email, password) => {
    if (!validateEmailDomain(email)) {
        return {
            success: false,
            message: 'Formato de correo no válido.',
        };
    }

    const result = await AuthPort.loginUser(email, password);
    return result;
};
