import React, { useState, useCallback } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import CategoryService from '../../../../services/products/CategoryService';
import './CategorySearch.css';

const CategorySearch = ({ setFilteredCategories, toast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCriteria, setSearchCriteria] = useState({ code: '' });

    // Función común para realizar la búsqueda
    const fetchFiltereCategories = useCallback(async (criteria, term) => {

        try {
            let filteredResults;
            console.log(`Buscando por ${criteria} con el término: ${term}`);

            // Llamar al servicio según el criterio de búsqueda
            if (criteria === 'nombre') {
                filteredResults = await CategoryService.findByName(term);
            } else if (criteria === 'estado') {
                filteredResults = await CategoryService.findByStatus(term);
            } else if (criteria === 'id_categoria') {
                filteredResults = await CategoryService.findCategoryById(term);
            }
            console.log(filteredResults)
            // Verificar si la respuesta contiene la propiedad 'content' y si tiene resultados
            if (filteredResults && filteredResults.content && filteredResults.content.length > 0) {
                console.log('Resultados de búsqueda:', filteredResults);
                setFilteredCategories(filteredResults.content);  // Usar 'content' como array de resultados
                toast.current?.show({
                    severity: 'success',
                    summary: 'Búsqueda exitosa',
                    detail: 'Se encontraron resultados.',
                    life: 3000,
                });
            } else {
                // Limpiar los resultados si no se encuentran categorías
                setFilteredCategories([]);
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Sin resultados',
                    detail: 'No se encontraron categorías.',
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo realizar la búsqueda.',
                life: 3000,
            });
        }
    }, [setFilteredCategories, toast]);

    // Función para manejar la búsqueda al hacer clic en "Buscar"
    const handleSearch = () => {
        if (!searchCriteria.code) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Seleccione un criterio de búsqueda antes de escribir.',
                life: 3000,
            });
            return;
        }

        if (!searchTerm.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, ingrese un término de búsqueda.',
                life: 3000,
            });
            return;
        }

        fetchFiltereCategories(searchCriteria.code, searchTerm);
    };

    // Función para limpiar la búsqueda
    const handleClear = () => {
        setSearchTerm('');
        setSearchCriteria({ code: '' });
        setFilteredCategories([]); // Limpiar los resultados filtrados
        toast.current?.show({
            severity: 'info',
            summary: 'Filtros limpiados',
            detail: 'La búsqueda se ha restablecido.',
            life: 3000,
        });

    };

    return (
        <div className="category-search-section">
            <div className="category-search-input">
                <Dropdown
                    value={searchCriteria.code}
                    options={[
                        { name: 'Nombre', code: 'nombre' },
                        { name: 'Estado', code: 'estado' },
                    ]}
                    onChange={(e) => setSearchCriteria({ code: e.value })}
                    optionLabel="name"
                    optionValue="code"
                    placeholder="Seleccione un criterio"
                    className="category-search-dropdown"
                />
                <InputText
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por..."
                    className="category-search-input-text"
                    disabled={!searchCriteria.code} // Deshabilitar hasta que se seleccione un criterio
                />
            </div>
            <div className="category-search-buttons">
                <button className="search-button" onClick={handleSearch}>Buscar</button>
                <button className="clear-button" onClick={handleClear}>Limpiar</button>
            </div>
        </div>
    );
};

export default CategorySearch;
