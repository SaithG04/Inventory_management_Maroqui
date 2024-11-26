// utils/modalMessages.js

export const productModalMessages = {
    edit: (productName) => `¿Estás seguro de que deseas editar el producto "${productName}"?`,
    delete: (productName) => `¿Estás seguro de que deseas eliminar el producto "${productName}"?`,
    default: () => '¿Estás seguro de realizar esta acción con el producto?',
};

export const categoryModalMessages = {
    edit: (categoryName) => `¿Estás seguro de que deseas editar la categoría "${categoryName}"?`,
    delete: (categoryName) => `¿Estás seguro de que deseas eliminar la categoría "${categoryName}"?`,
    default: () => '¿Estás seguro de realizar esta acción con la categoría?',
};
