// shared/searchUtils.js

import { normalizeString } from './utils'; // Asegúrate de que esta función esté importada correctamente.

/**
 * Filtra una lista de elementos con un término de búsqueda y filtros adicionales.
 *
 * @param {Array} items - Lista de elementos a filtrar.
 * @param {string} searchTerm - Término de búsqueda.
 * @param {string} searchKey - Clave del objeto donde se buscará el término.
 * @param {function|null} additionalFilter - Filtro adicional como función (opcional).
 * @returns {Array} - Lista filtrada de elementos.
 */
export const filterItems = ({
    items,
    searchTerm = '',
    searchKey = '',
    additionalFilter = null,
}) => {
    let results = items;

    if (searchTerm) {
        const normalizedSearchTerm = normalizeString(searchTerm);
        results = results.filter(item =>
            normalizeString(item[searchKey]?.toString()).includes(normalizedSearchTerm)
        );
    }

    if (additionalFilter) {
        results = results.filter(additionalFilter);
    }

    return results;
};
