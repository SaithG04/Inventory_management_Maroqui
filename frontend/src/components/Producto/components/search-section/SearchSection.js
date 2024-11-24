import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import ProductService from '../../../../services/ProductService';
import './SearchSection.css';

const SearchSection = ({
    searchOptions = [
        { name: 'Nombre', code: 'nombre' },
        { name: 'Categoría', code: 'id_categoria' },
        { name: 'Estado', code: 'estado' }
    ],
    searchTerm,
    setSearchTerm,
    setFilteredProducts,
    products,
    categories,
    toast,
    successMessage = 'Se encontraron productos.',
    noResultsMessage = 'No se encontraron productos.',
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
    const handleSearchClick = async () => {
        // Validar si el criterio de búsqueda, el término de búsqueda y los checkboxes están vacíos
        if (!searchCriteria && !searchTerm.trim() && !selectedAvailability) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, seleccione un criterio de búsqueda, ingrese un término válido o marque una opción de disponibilidad.',
                life: 3000,
            });
            return; // Salir de la función si no se cumple la validación
        }
    
        let filteredResults;
    
        try {
            // Empezamos con todos los productos o categorías según la vista actual
            filteredResults = showProductTable ? [...products] : [...categories];
    
            // Aplicar filtro de búsqueda si se selecciona un criterio y se ingresa un término
            if (searchCriteria?.code && searchTerm) {
                if (showProductTable) {
                    // Lógica de búsqueda para productos
                    if (searchCriteria.code === 'nombre') {
                        // Filtrar por nombre de producto
                        filteredResults = filteredResults.filter(item =>
                            item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    } else if (searchCriteria.code === 'id_categoria') {
                        // Buscar productos por nombre de categoría utilizando el servicio
                        filteredResults = await ProductService.findByCategoryName(searchTerm);
                    } else if (searchCriteria.code === 'estado') {
                        // Convertir 'Activo', 'Inactivo', y 'Sin stock' a 'ACTIVE', 'INACTIVE', y 'OUT_OF_STOCK' para el backend
                        let translatedStatus = 
                            searchTerm.toLowerCase() === 'activo' ? 'ACTIVE' : 
                            searchTerm.toLowerCase() === 'inactivo' ? 'INACTIVE' : 
                            searchTerm.toLowerCase() === 'sin stock' ? 'OUT_OF_STOCK' : 
                            searchTerm;
    
                        // Filtrar por estado del producto (localmente)
                        filteredResults = filteredResults.filter(product =>
                            product.estado && product.estado.toLowerCase() === translatedStatus.toLowerCase()
                        );
                    }
                } else {
                    // Lógica de búsqueda para categorías
                    if (searchCriteria.code === 'nombre') {
                        // Filtrar por nombre de la categoría
                        filteredResults = filteredResults.filter(category =>
                            category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    } else if (searchCriteria.code === 'estado') {
                        // Convertir 'Activo' e 'Inactivo' a 'ACTIVE' e 'INACTIVE' para el backend
                        let translatedStatus = 
                            searchTerm.toLowerCase() === 'activo' ? 'ACTIVE' : 
                            searchTerm.toLowerCase() === 'inactivo' ? 'INACTIVE' : 
                            searchTerm;
    
                        // Filtrar por estado de la categoría (localmente)
                        filteredResults = filteredResults.filter(category =>
                            category.estado && category.estado.toLowerCase() === translatedStatus.toLowerCase()
                        );
                    }
                }
            }
    
            // Aplicar filtro de disponibilidad con los checkboxes seleccionados
            if (selectedAvailability) {
                if (showProductTable) {
                    if (selectedAvailability === 'Con Stock') {
                        // Filtrar productos que tienen stock disponible
                        filteredResults = filteredResults.filter(product => product.stock > 0);
                    } else if (selectedAvailability === 'Sin Stock') {
                        // Filtrar productos que no tienen stock
                        filteredResults = filteredResults.filter(product => product.stock === 0);
                    }
                } else {
                    if (selectedAvailability === 'Activo') {
                        // Filtrar categorías activas
                        filteredResults = filteredResults.filter(category => category.estado && category.estado.toLowerCase() === 'active');
                    } else if (selectedAvailability === 'Inactivo') {
                        // Filtrar categorías inactivas
                        filteredResults = filteredResults.filter(category => category.estado && category.estado.toLowerCase() === 'inactive');
                    }
                }
            }
    
            setFilteredProducts(filteredResults);
    
            // Mostrar mensaje según los resultados obtenidos
            toast.current?.show({
                severity: filteredResults.length > 0 ? 'success' : 'warn',
                summary: filteredResults.length > 0 ? 'Búsqueda exitosa' : 'Sin resultados',
                detail: filteredResults.length > 0 ? successMessage : noResultsMessage,
                life: 3000,
            });
    
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error en la búsqueda',
                detail: 'Hubo un problema al realizar la búsqueda.',
                life: 3000,
            });
        }
    };
    

    // Manejo del botón "Limpiar"
    const handleClearClick = () => {
        setSearchTerm(''); // Limpiar el término de búsqueda
        setSearchCriteria(null); // Limpiar el criterio de búsqueda
        setSelectedAvailability(null); // Limpiar la disponibilidad seleccionada
        setFilteredProducts(products); // Restaurar la lista de productos original

        // Mostrar un mensaje de que se ha limpiado el filtro
        toast.current?.show({
            severity: 'info',
            summary: 'Filtros limpiados',
            detail: 'La búsqueda se ha restablecido y se han cargado todos los productos.',
            life: 3000
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
                    const selectedOption = searchOptions.find(opt => opt.code === e.value);
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
