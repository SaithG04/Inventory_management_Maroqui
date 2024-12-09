// utils/translate.js
export const traducirEstado = (estado) => {
    switch (estado) {
        case 'ACTIVE':
            return 'ACTIVO';
        case 'OUT_OF_STOCK':
            return 'SIN STOCK';
        default:
            return estado; // Si no hay mapeo, devolver el estado original
    }
};
