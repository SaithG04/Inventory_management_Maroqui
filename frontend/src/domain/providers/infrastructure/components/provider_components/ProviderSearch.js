import React, { useState, useRef, useMemo } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import ProviderService from '../../../domain/services/ProviderService'; // Asegúrate de importar el servicio
import './ProviderSearch.css'; // Asegúrate de importar el archivo CSS

const ProviderSearch = ({ onSearchResults, onClearSearch }) => {
  const [searchType, setSearchType] = useState('name'); // Inicializamos con 'name'
  const [query, setQuery] = useState(''); // Valor de búsqueda
  const [status, setStatus] = useState('ACTIVE'); // Estado del proveedor
  const [loading, setLoading] = useState(false); // Indicador de carga
  const toast = useRef(null); // Referencia para el Toast

  // Memorizar la instancia de ProviderService
  const providerService = useMemo(() => new ProviderService(), []);

  // Función de búsqueda
  const handleSearch = async () => {
    setLoading(true);
  
    try {
      let response = [];
  
      // Búsqueda por nombre
      if (searchType === 'name' && query) {
        response = await providerService.findByName(query, 0, 15);
      }
      // Búsqueda por estado
      else if (searchType === 'status') {
        response = await providerService.findByStatus(status, 0, 15);
      }
  
      // Aquí ya no necesitas acceder a response.data.content, porque la respuesta es un array directo
      if (Array.isArray(response)) {
        onSearchResults(response); // Pasar los resultados al componente padre
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No providers found.', life: 3000 });
        onSearchResults([]); // Si no hay resultados, vaciar la lista
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching results.', life: 3000 });
      onSearchResults([]); // Si ocurre un error, vaciar la lista
    } finally {
      setLoading(false);
    }
  };
  
  // Función para limpiar los campos de búsqueda
  const handleClearSearch = () => {
    setQuery('');
    setStatus('ACTIVE');
    onClearSearch(); // Limpiar los resultados en el componente padre
  };

  return (
    <div className="provider-search-section">
      <Toast ref={toast} />

      <div className="provider-search-dropdown">
        <label>
          <Dropdown
            value={searchType}
            options={[
              { label: 'Name', value: 'name' },
              { label: 'Status', value: 'status' },
            ]}
            onChange={(e) => {
              setSearchType(e.value);
            }}
            placeholder="Select Search Type"
          />
        </label>
      </div>

      {searchType === 'status' ? (
        <div className="provider-input">
          <label>
            <Dropdown
              value={status}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
              onChange={(e) => {
                setStatus(e.value);
              }}
              placeholder="Select Status"
            />
          </label>
        </div>
      ) : (
        <div className="provider-input">
          <InputText
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder={`Search by ${searchType}`}
          />
        </div>
      )}

      {/* Botones de búsqueda y limpiar */}
      <div className="search-clear-buttons">
        <Button
          label={loading ? 'Searching...' : 'Search'}
          onClick={handleSearch}
          disabled={loading}
          className="search-button"
        />
        <Button
          label="Clear"
          onClick={handleClearSearch}
          disabled={loading}
          className="clear-button"
        />
      </div>
    </div>
  );
};

export default ProviderSearch;
