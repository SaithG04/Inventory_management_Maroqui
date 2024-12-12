import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import ProviderService from '../../../../providers/domain/services/ProviderService'; // Importar ProviderService
import ProductProviderService from './../../../domain/services/ProductProviderService'; // Importar ProductProviderService
import './ProductProviderSearch.css'; // Importar el archivo CSS

const ProductProviderSearch = ({ providers, onProviderSelected, onClearSearch, onSearchResults }) => {
  const [selectedSupplier, setSelectedSupplier] = useState(null); // Proveedor seleccionado
  const [suppliers, setSuppliers] = useState([]); // Lista de proveedores
  const [loading, setLoading] = useState(false); // Indicador de carga
  const toast = useRef(null); // Referencia para el Toast

  // Memorizar las instancias de los servicios
  const providerService = useMemo(() => new ProviderService(), []);
  const productProviderService = useMemo(() => new ProductProviderService(), []);

  // Obtener la lista de proveedores al montar el componente
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Puedes ajustar la paginación si tienes muchos proveedores
        const response = await providerService.getAllProviders(0, 100); // Por ejemplo, obtener hasta 100 proveedores
        setSuppliers(response.data.content); // Asegúrate de que 'content' contiene la lista
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching suppliers.', life: 3000 });
      }
    };

    fetchSuppliers();
  }, [providerService]);

  // Función de búsqueda
  const handleSearch = async () => {
    if (!selectedSupplier) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, selecciona un proveedor.', life: 3000 });
      return;
    }

    console.log("Proveedor seleccionado:", selectedSupplier); // Debug: Verificar proveedor seleccionado

    setLoading(true);
  
    try {
      const response = await productProviderService.getProductsBySupplierId(selectedSupplier.id);
      console.log("Respuesta del backend:", response); // Debug: Verificar respuesta del backend
  
      if (Array.isArray(response) && response.length > 0) {
        onSearchResults(response); // Actualiza la lista en el componente padre
      } else {
        toast.current.show({ severity: "warn", summary: "Sin Resultados", detail: "No se encontraron relaciones.", life: 3000 });
        console.warn("Relaciones no encontradas para el proveedor seleccionado.");
        onSearchResults([]); // Limpia los resultados en caso de no encontrar relaciones
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error); // Debug: Captura el error
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo completar la búsqueda.", life: 3000 });
      onSearchResults([]); // Limpia los resultados en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar los campos de búsqueda
  const handleClearSearch = () => {
    setSelectedSupplier(null);
    onClearSearch(); // Limpiar los resultados en el componente padre
  };

  return (
    <div className="product-provider-search-section">
      <Toast ref={toast} />

      {/* Campo de selección de Proveedor */}
      <div className="product-provider-dropdown">
        <Dropdown
          value={selectedSupplier}
          options={suppliers}
          onChange={(e) => setSelectedSupplier(e.value)}
          optionLabel="name" // Asegúrate de que 'name' es el campo que contiene el nombre del proveedor
          placeholder="Selecciona un Proveedor"
          className="w-full md:w-14rem"
          filter
          showClear
          filterBy="name"
        />
      </div>

      {/* Botones de búsqueda y limpiar */}
      <div className="search-clear-buttons">
        <Button
          label={loading ? 'Buscando...' : 'Buscar'}
          onClick={handleSearch}
          disabled={loading || !selectedSupplier}
          className="search-button"
        />
        <Button
          label="Limpiar"
          onClick={handleClearSearch}
          disabled={loading}
          className="clear-button"
        />
      </div>
    </div>
  );
};

export default ProductProviderSearch;
