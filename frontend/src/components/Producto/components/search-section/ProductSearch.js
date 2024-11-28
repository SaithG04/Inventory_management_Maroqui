import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import ProductService from '../../../../services/products/ProductService';
import './ProductSearch.css';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';

const ProductSearch = ({ setFilteredProducts, toast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({ code: '' });
  const [selectedAvailability, setSelectedAvailability] = useState(null);

  // Función común para manejar la búsqueda
  const fetchFilteredProducts = useCallback(async (criteria, term, availability) => {
    if (!criteria) return;

    let filteredResults;
    try {
      // Llamar a la API según el criterio de búsqueda
      if (criteria === 'nombre') {
        filteredResults = await ProductService.findByName(term);
      } else if (criteria === 'id_categoria') {
        filteredResults = await ProductService.findByCategoryName(term);
      } else if (criteria === 'estado') {
        const statusValidated = validateStatus(term);
        if (statusValidated != null) {
          filteredResults = await ProductService.findByStatus(statusValidated);
        } else {
          toast.current?.show({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Ingrese un estado válido.',
            life: 3000,
          });
          return;
        }
      }

      if (filteredResults && filteredResults.length > 0) {
        // Aplicar el filtro de disponibilidad
        if (availability) {
          filteredResults = filteredResults.filter(item => {
            if (availability === 'Con Stock') return item.stock > 0;
            if (availability === 'Sin Stock') return item.stock === 0;
            return true;
          });
        }

        setFilteredProducts(filteredResults);
        toast.current?.show({
          severity: filteredResults.length > 0 ? 'success' : 'warn',
          summary: filteredResults.length > 0 ? 'Búsqueda exitosa' : 'Sin resultados',
          detail: filteredResults.length > 0 ? 'Se encontraron resultados.' : 'No se encontraron resultados.',
          life: 3000,
        });
      } else {
        setFilteredProducts([]);
        toast.current?.show({
          severity: 'warn',
          summary: 'Sin resultados',
          detail: 'No se encontraron productos.',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error en la búsqueda de productos:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un error al realizar la búsqueda.',
        life: 3000,
      });
    }
  }, [setFilteredProducts, toast]);

  // Función para validar el estado
  const validateStatus = (status) => {
    let estado = status.toLocaleLowerCase();
    if (estado === 'activo') return 'ACTIVE';
    if (estado === 'descontinuado') return 'DISCONTINUED';
    if (estado === 'fuera de stock') return 'OUT_OF_STOCK';
    return null;
  };

  // Función para manejar la búsqueda
  const handleSearchClick = () => {
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

    fetchFilteredProducts(searchCriteria.code, searchTerm, selectedAvailability);
  };

  // Función para limpiar la búsqueda
  const handleClearClick = () => {
    setSearchTerm('');
    setSearchCriteria({ code: '' });
    setSelectedAvailability(null);
    setFilteredProducts([]); // Limpiar los productos filtrados
    toast.current?.show({
      severity: 'info',
      summary: 'Filtros limpiados',
      detail: 'La búsqueda se ha restablecido.',
      life: 3000,
    });
  };

  // Función de búsqueda con debounce
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (!searchCriteria.code || !searchTerm.trim()) return;
      fetchFilteredProducts(searchCriteria.code, searchTerm, selectedAvailability);
    }, 500);

    debouncedSearch(); // Ejecutar la búsqueda con el debounce
    return () => debouncedSearch.cancel(); // Limpiar el debounce cuando el componente se desmonte
  }, [searchTerm, searchCriteria, selectedAvailability, fetchFilteredProducts]); // Añadir las dependencias necesarias

  return (
    <div className="product-search-section">
      <div className="product-search-input">
        <Dropdown
          value={searchCriteria.code}
          options={[
            { name: 'Nombre', code: 'nombre' },
            { name: 'Categoría', code: 'id_categoria' },
            { name: 'Estado', code: 'estado' },
          ]}
          onChange={(e) => setSearchCriteria({ code: e.value })}
          optionLabel="name"
          optionValue="code"
          placeholder="Seleccione un criterio"
          className="product-search-dropdown"
        />
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por..."
          className="product-search-input-text"
          disabled={!searchCriteria.code} // Deshabilitar hasta que se seleccione un criterio
        />
      </div>
      <div className="product-search-buttons">
        <button className="search-button" onClick={handleSearchClick}>Buscar</button>
        <button className="clear-button" onClick={handleClearClick}>Limpiar</button>
      </div>
      <div className="checkbox-group">
        <Checkbox
          checked={selectedAvailability === 'Con Stock'}
          onChange={() => setSelectedAvailability(selectedAvailability === 'Con Stock' ? null : 'Con Stock')}
        />
        <label>Con Stock</label>
        <Checkbox
          checked={selectedAvailability === 'Sin Stock'}
          onChange={() => setSelectedAvailability(selectedAvailability === 'Sin Stock' ? null : 'Sin Stock')}
        />
        <label>Sin Stock</label>
      </div>
    </div>
  );
};

export default ProductSearch;
