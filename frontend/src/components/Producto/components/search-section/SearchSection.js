import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { handleSearch, handleClearSearch } from '../../../shared/actionbutton/buttonFunctions'; // Utiliza las funciones globales
import './SearchSection.css';

const SearchSection = ({
    searchOptions = [
        { name: 'Nombre', code: 'name' },
        { name: 'Categoría', code: 'category' },
        { name: 'Descripción', code: 'description' }
    ],
    searchTerm,
    setSearchTerm,
    setFilteredProducts,
    products,
    toast,
    successMessage = 'Se encontraron productos.',
    noResultsMessage = 'No se encontraron productos.'
}) => {
    const [searchCriteria, setSearchCriteria] = useState(null); // Inicializa con null
    const [selectedAvailability, setSelectedAvailability] = useState(null); // Estado para el filtro del checkbox
    const [filteredProductsState, setFilteredProductsState] = useState([]); // Estado para manejar las sugerencias de autocompletado
    const [showAutocomplete, setShowAutocomplete] = useState(false); // Estado para manejar la visibilidad de la lista de autocompletado

    // Mostrar la lista cuando cambia el término de búsqueda
    const handleSearchTermChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowAutocomplete(true); // Mostrar la lista de autocompletado

        // Filtrar productos según el término de búsqueda y criterio
        if (searchCriteria && searchCriteria.name && value) {
            const filtered = products.filter(product => {
                const fieldValue = product[searchCriteria.name]?.toString().toLowerCase();
                return fieldValue?.includes(value.toLowerCase());
            });
            setFilteredProductsState(filtered);
        } else {
            setFilteredProductsState([]); // Limpiar si no hay búsqueda
        }
    };

    // Manejar la selección de un elemento de la lista de autocompletado
    const handleAutocompleteClick = (product) => {
        setSearchTerm(product[searchCriteria.name]); // Actualizar el término de búsqueda con el valor seleccionado
        setShowAutocomplete(false); // Ocultar la lista de autocompletado
    };

    // Manejar la selección de checkboxes (almacenar estado sin aplicar búsqueda)
    const handleCheckboxChange = (status) => {
        if (selectedAvailability === status) {
            setSelectedAvailability(null); // Deseleccionar si ya estaba seleccionado
        } else {
            setSelectedAvailability(status); // Actualizar el valor del checkbox
        }
    };

    // Manejo de la búsqueda al dar clic en el botón "Buscar"
    const handleSearchClick = () => {
        // Verificar si el criterio de búsqueda ha sido seleccionado y el input de búsqueda no está vacío
        if (!searchCriteria && !selectedAvailability) {
            toast.current.show({
                severity: 'warn',
                summary: 'Criterio no seleccionado',
                detail: 'Por favor, selecciona un criterio de búsqueda o un estado antes de buscar.',
                life: 3000
            });
            return; // No continuar si no se seleccionó un criterio ni un estado
        }

        // Utiliza la función global `handleSearch` y pasa los mensajes personalizados
        handleSearch(searchTerm, setSearchTerm, setFilteredProducts, products, toast, searchCriteria, selectedAvailability, successMessage, noResultsMessage);
    };

    // Manejo del botón "Limpiar"
    const handleClearClick = () => {
        handleClearSearch(setSearchTerm, setFilteredProducts, products, toast);
        setSearchCriteria(null); // Limpiar el criterio de búsqueda
        setSelectedAvailability(null); // Limpiar también el estado del checkbox
        setShowAutocomplete(false); // Ocultar la lista de autocompletado
    };

    return (
        <div className="search-section">
            {/* Dropdown para seleccionar el criterio de búsqueda */}
            <Dropdown
                className="search-dropdown"
                value={searchCriteria} // Aquí, se pasa searchCriteria
                options={searchOptions}
                onChange={(e) => setSearchCriteria(e.value)} // Actualiza searchCriteria al seleccionar
                optionLabel="name" // Se muestra el nombre de la categoría
                optionValue="code" // El valor subyacente
                placeholder="Seleccione un criterio"
            />

            {/* Campo de búsqueda */}
            <div className="p-inputgroup" style={{ position: 'relative' }}>
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search" />
                </span>
                <InputText
                    type="text"
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder={`Buscar por ${searchCriteria?.name || '...'}`} // Cambia el placeholder dinámicamente
                />

                {/* Mostrar sugerencias de autocompletado */}
                {showAutocomplete && filteredProductsState.length > 0 && (
                    <div className="autocomplete-list">
                        {filteredProductsState.map((product, index) => (
                            <div
                                key={index}
                                className="autocomplete-item"
                                onClick={() => handleAutocompleteClick(product)} // Al hacer clic, se selecciona el valor y se oculta la lista
                            >
                                {product[searchCriteria?.name]} {/* Mostrar el valor según el criterio seleccionado */}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Botones para buscar y limpiar */}
            <button onClick={handleSearchClick} className="search-button">
                Buscar
            </button>
            <button onClick={handleClearClick} className="clear-button">
                Limpiar
            </button>

            {/* Filtros de disponibilidad */}
            <div className="checkbox-group">
                <div className="checkbox-item">
                    <Checkbox
                        inputId="activo"
                        checked={selectedAvailability === 'Activo'}
                        onChange={() => handleCheckboxChange('Activo')}
                    />
                    <label htmlFor="activo">Activo</label>
                </div>
                <div className="checkbox-item">
                    <Checkbox
                        inputId="sinStock"
                        checked={selectedAvailability === 'Sin stock'}
                        onChange={() => handleCheckboxChange('Sin stock')}
                    />
                    <label htmlFor="sinStock">Sin stock</label>
                </div>
            </div>
        </div>
    );
};

export default SearchSection;
