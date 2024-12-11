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
        { name: 'Estado', code: 'status' }
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

    // Manejo del cambio en el término de búsqueda
    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Manejar la selección de checkboxes
    const handleCheckboxChange = (status) => {
        setSelectedAvailability(selectedAvailability === status ? null : status);
    };

    // Manejo de la búsqueda al dar clic en el botón "Buscar"
    const handleSearchClick = () => {
        // Si no hay término de búsqueda ni disponibilidad seleccionada, mostrar advertencia
        if (!searchCriteria && !selectedAvailability) {
            toast.current.show({
                severity: 'warn',
                summary: 'Criterio no seleccionado',
                detail: 'Por favor, selecciona un criterio de búsqueda o un estado antes de buscar.',
                life: 3000
            });
            return;
        }

        // Utilizar la función `handleSearch` para el término de búsqueda y aplicar filtro de disponibilidad
        let filteredResults = products;

        // Aplicar búsqueda por término si está definido
        if (searchTerm) {
            handleSearch(searchTerm, setSearchTerm, setFilteredProducts, products, toast, searchCriteria, null, successMessage, noResultsMessage);
            filteredResults = filteredResults.filter(product =>
                product[searchCriteria?.code]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Aplicar filtro por disponibilidad
        if (selectedAvailability === 'Con Stock') {
            filteredResults = filteredResults.filter(product => product.stock > 0);
        } else if (selectedAvailability === 'Sin Stock') {
            filteredResults = filteredResults.filter(product => product.stock === 0);
        }

        setFilteredProducts(filteredResults);

        // Mostrar mensaje según los resultados obtenidos
        toast.current.show({
            severity: filteredResults.length > 0 ? 'success' : 'warn',
            summary: filteredResults.length > 0 ? 'Búsqueda exitosa' : 'Sin resultados',
            detail: filteredResults.length > 0 ? successMessage : noResultsMessage,
            life: 3000
        });
    };

    // Manejo del botón "Limpiar"
    const handleClearClick = () => {
        handleClearSearch(setSearchTerm, setFilteredProducts, products, toast);
        setSearchCriteria(null); // Limpiar el criterio de búsqueda
        setSelectedAvailability(null); // Limpiar también el estado del checkbox
    };

    return (
        <div className="search-section">
            {/* Dropdown para seleccionar el criterio de búsqueda */}
            <Dropdown
                className="search-dropdown"
                value={searchCriteria?.code} // Aquí utilizamos el código del criterio seleccionado
                options={searchOptions}
                onChange={(e) => {
                    const selectedOption = searchOptions.find(opt => opt.code === e.value);
                    setSearchCriteria(selectedOption); // Actualizamos el objeto completo
                }}
                optionLabel="name" // Mostrar el nombre del criterio
                optionValue="code" // Utilizar el código como valor subyacente
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
                    placeholder={`Buscar por ${searchCriteria?.name || '...'}`}
                />
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
                        inputId="conStock"
                        checked={selectedAvailability === 'Con Stock'}
                        onChange={() => handleCheckboxChange('Con Stock')}
                    />
                    <label htmlFor="conStock">Con Stock</label>
                </div>
                <div className="checkbox-item">
                    <Checkbox
                        inputId="sinStock"
                        checked={selectedAvailability === 'Sin Stock'}
                        onChange={() => handleCheckboxChange('Sin Stock')}
                    />
                    <label htmlFor="sinStock">Sin Stock</label>
                </div>
            </div>
        </div>
    );
};

export default SearchSection;
