import { normalizeString } from '../../shared/actionbutton/utils'; // Importa la función de normalización

// shared/actionbutton/buttonFunctions.js

// Función para manejar el botón de Buscar
export const handleSearch = (
    searchTerm,
    setSearchTerm,
    setFilteredProducts,
    products,
    toast,
    searchCriteria,
    selectedAvailability,
    successMessage = 'Se encontraron productos.',
    noResultsMessage = 'No se encontraron productos.'
) => {
    if (!searchTerm && !selectedAvailability) {
        // Si no hay término de búsqueda ni estado seleccionado, mostrar todos los productos
        setFilteredProducts(products);
        return;
    }

    let filteredResults = products;

    if (searchTerm) {
        const normalizedSearchTerm = normalizeString(searchTerm);
        filteredResults = filteredResults.filter(product =>
            normalizeString(product[searchCriteria]?.toString()).includes(normalizedSearchTerm)
        );
    }

    if (selectedAvailability) {
        filteredResults = filteredResults.filter(product => product.status === selectedAvailability);
    }

    setFilteredProducts(filteredResults);

    // Mostrar mensaje de éxito o advertencia según los resultados de la búsqueda
    toast.current.show({
        severity: filteredResults.length > 0 ? 'success' : 'warn',
        summary: filteredResults.length > 0 ? 'Búsqueda exitosa' : 'Sin resultados',
        detail: filteredResults.length > 0 ? successMessage : noResultsMessage,
        life: 3000
    });
};


// Función para manejar el botón de Limpiar
export const handleClearSearch = (setSearchTerm, setFilteredProducts, products, toast) => {
    setSearchTerm('');
    setFilteredProducts(products);

    toast.current.show({
        severity: 'info',
        summary: 'Búsqueda limpiada',
        detail: 'Los filtros han sido restablecidos.',
        life: 3000
    });
};


// utils/productUtils.js

// Mensajes globales para productos
export const messages = {
    incomplete: 'Por favor complete todos los campos antes de guardar.',
    addSummary: 'Producto agregado correctamente.',
    addDetail: 'El producto ha sido agregado con éxito.',
    editSummary: 'Producto actualizado correctamente.',
    editDetail: 'El producto ha sido actualizado con éxito.'
};


// En buttonFunctions.js
export const handleAddOrEditItem = (item, isEditing, addItem, updateItem, toast, setShowForm, successMessages) => {
    const updatedItem = {
        ...item,
        description: item.description || "Sin descripción", // Agregar una descripción por defecto si no tiene
    };

    if (isEditing) {
        updateItem(updatedItem);
        toast.current.show({ 
            severity: 'success', 
            summary: successMessages.editSummary || 'Elemento editado', 
            detail: successMessages.editDetail || 'Los datos fueron actualizados correctamente.' 
        });
    } else {
        addItem(updatedItem);
        toast.current.show({ 
            severity: 'success', 
            summary: successMessages.addSummary || 'Elemento agregado', 
            detail: successMessages.addDetail || 'El nuevo elemento fue agregado correctamente.' 
        });
    }

    setShowForm(false); // Ocultar el formulario después de la acción
};

// Función para manejar el botón de Eliminar Item
export const handleDeleteItem = (itemId, deleteItem, toast, messages) => {
    deleteItem(itemId);
    toast.current.show({
        severity: 'success',
        summary: messages?.deleteSummary || 'Elemento Eliminado',
        detail: messages?.deleteDetail || 'El elemento ha sido eliminado con éxito.',
        life: 3000
    });
};


