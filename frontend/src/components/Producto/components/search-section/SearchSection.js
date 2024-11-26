import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { filterItems } from '../../../shared/actionbutton/searchUtils'; // Usamos la función genérica
import './SearchSection.css';

const SearchSection = ({
    searchOptions = [
        { name: 'Nombre', code: 'nombre' },
        { name: 'Categoría', code: 'id_categoria' },
        { name: 'Estado', code: 'estado' },
    ],
    searchTerm,
    setSearchTerm,
    setFilteredProducts,
    products,
    categories,
    toast,
    successMessage = 'Se encontraron resultados.',
    noResultsMessage = 'No se encontraron resultados.',
    showProductTable,
}) => {
    const [searchCriteria, setSearchCriteria] = useState(null);
    const [selectedAvailability, setSelectedAvailability] = useState(null);

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
        if (!searchCriteria && !selectedAvailability) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Seleccione un criterio de búsqueda o marque una opción de disponibilidad.',
                life: 3000,
            });
            return;
        }

        if (searchCriteria && !searchTerm.trim()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, ingrese un término de búsqueda.',
                life: 3000,
            });
            return;
        }

        // Determinar si trabajar con productos o categorías
        let dataToFilter = showProductTable ? products : categories;

        // Filtrar usando `filterItems`
        const filteredResults = filterItems({
            items: dataToFilter,
            searchTerm,
            searchKey: searchCriteria?.code,
            additionalFilter: (item) => {
                if (selectedAvailability) {
                    if (showProductTable) {
                        if (selectedAvailability === 'Con Stock') {
                            return item.stock > 0;
                        } else if (selectedAvailability === 'Sin Stock') {
                            return item.stock === 0;
                        }
                    } else {
                        if (selectedAvailability === 'Activo') {
                            return item.estado?.toLowerCase() === 'active';
                        } else if (selectedAvailability === 'Inactivo') {
                            return item.estado?.toLowerCase() === 'inactive';
                        }
                    }
                }
                return true; // Si no hay disponibilidad seleccionada, incluir todos
            },
        });

        setFilteredProducts(filteredResults);

        // Mostrar mensaje de resultados
        toast.current?.show({
            severity: filteredResults.length > 0 ? 'success' : 'warn',
            summary: filteredResults.length > 0 ? 'Búsqueda exitosa' : 'Sin resultados',
            detail: filteredResults.length > 0 ? successMessage : noResultsMessage,
            life: 3000,
        });
    };

    // Manejo del botón "Limpiar"
    const handleClearClick = () => {
        setSearchTerm('');
        setSearchCriteria(null);
        setSelectedAvailability(null);
        setFilteredProducts(products);

        toast.current?.show({
            severity: 'info',
            summary: 'Filtros limpiados',
            detail: 'La búsqueda se ha restablecido.',
            life: 3000,
        });
    };

    return (
        <div className="search-section">
            {/* Dropdown para seleccionar el criterio de búsqueda */}
            <Dropdown
                className="search-dropdown"
                value={searchCriteria?.code}
                options={searchOptions}
                onChange={(e) => {
                    const selectedOption = searchOptions.find((opt) => opt.code === e.value);
                    setSearchCriteria(selectedOption);
                }}
                optionLabel="name"
                optionValue="code"
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
                    disabled={!searchCriteria} // Desactivar si no hay un criterio seleccionado
                />
            </div>

            {/* Botones de acción */}
            <button onClick={handleSearchClick} className="search-button">
                Buscar
            </button>
            <button onClick={handleClearClick} className="clear-button">
                Limpiar
            </button>

            {/* Filtros de disponibilidad */}
            <div className="checkbox-group">
                {showProductTable ? (
                    <>
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
                    </>
                ) : (
                    <>
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
                                inputId="inactivo"
                                checked={selectedAvailability === 'Inactivo'}
                                onChange={() => handleCheckboxChange('Inactivo')}
                            />
                            <label htmlFor="inactivo">Inactivo</label>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchSection;
