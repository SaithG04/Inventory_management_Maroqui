// Función para normalizar una cadena de texto (ignorar mayúsculas y tildes)
export const normalizeString = (str) => {
    return str
        .toLowerCase()  // Convierte todo a minúsculas
        .normalize('NFD')  // Normaliza los caracteres Unicode
        .replace(/[\u0300-\u036f]/g, '');  // Elimina los caracteres de acento
};

export const messages = {
    incomplete: 'Por favor complete todos los campos antes de guardar.',
    addSummary: 'Producto agregado correctamente.',
    addDetail: 'El producto ha sido agregado con éxito.',
    editSummary: 'Producto actualizado correctamente.',
    editDetail: 'El producto ha sido actualizado con éxito.'
};
