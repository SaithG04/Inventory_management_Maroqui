import React, { useState, useRef, useCallback, useMemo } from 'react'; // Agregar useMemo
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast'; // Importar Toast
import ProviderService from '../../../domain/services/ProviderService'; // Asegúrate de importar el servicio
import { ProviderDTO } from '../../dto/ProviderDTO'; // Asegúrate de importar el DTO
import './ProviderSearch.css'; // Asegúrate de importar el archivo CSS

const ProviderSearch = ({ onSearchResults }) => {
  const [searchType, setSearchType] = useState(''); // Tipo de búsqueda por 'name' o 'status'
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null); // Referencia para el Toast

  // Memorizar la instancia de ProviderService con useMemo
  const providerService = useMemo(() => new ProviderService(), []); // Crear la instancia una sola vez

  // Uso de useCallback para evitar la recreación de la función handleSearch en cada render
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      let response = [];

      // Realizar búsqueda según el tipo seleccionado
      if (searchType === 'name') {
        response = await providerService.findByName(query, 0, 15);
      } else if (searchType === 'status') {
        response = await providerService.findByStatus(status, 0, 15);
      }

      // Verificar y validar la respuesta
      if (response && Array.isArray(response.data)) {
        const providers = response.data
          .map((providerData) => {
            try {
              const providerDTO = new ProviderDTO(providerData); // Convertir la respuesta con el DTO
              return providerDTO.toDomain(); // Convertir a dominio
            } catch (err) {
              console.error("Error converting provider to domain:", err);
              return null;
            }
          })
          .filter((provider) => provider !== null); // Filtrar los datos válidos

        // Pasar los resultados al componente padre
        onSearchResults(providers);
      } else {
        // Mostrar notificación de error
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No providers found or invalid response structure.', life: 3000 });
        onSearchResults([]); // Limpiar resultados en caso de error
      }
    } catch (err) {
      console.error("Error fetching providers:", err);
      // Mostrar notificación de error
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching results.', life: 3000 });
      onSearchResults([]); // Limpiar resultados en error
    } finally {
      setLoading(false);
    }
  }, [searchType, query, status, providerService, onSearchResults]);

  // Función para limpiar los campos de búsqueda
  const handleClearSearch = () => {
    setQuery(""); // Limpiar query de búsqueda
    setStatus("ACTIVE"); // Resetear estado a 'ACTIVE'
    onSearchResults([]); // Limpiar los proveedores filtrados
  };

  return (
    <div className="provider-search-section">
      <Toast ref={toast} /> {/* Coloca el Toast en el componente */}

      <div className="provider-search-dropdown">
        <label>
          <Dropdown
            value={searchType}
            options={[
              { label: 'Name', value: 'name' },
              { label: 'Status', value: 'status' },
            ]}
            onChange={(e) => setSearchType(e.value)}
            placeholder="Select Search Type"
          />
        </label>
      </div>

      {/* Mostrar input o dropdown dependiendo del tipo de búsqueda */}
      {searchType === 'status' ? (
        <div className="provider-input">
          <label>
            <Dropdown
              value={status}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
              onChange={(e) => setStatus(e.value)}
              placeholder="Select Status"
            />
          </label>
        </div>
      ) : (
        <div className="provider-input">
          <InputText
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search by ${searchType}`}
          />
        </div>
      )}

      {/* Botones de búsqueda y limpiar */}
      <div className="search-clear-buttons"> {/* Usar la clase global del contenedor */}
        <Button
          label={loading ? 'Searching...' : 'Search'} // Texto dinámico para el estado de carga
          onClick={handleSearch} // Evento para realizar la búsqueda
          disabled={loading} // Desactiva el botón mientras está cargando
          className="search-button" // Clase global para el botón de búsqueda
        />
        <Button
          label="Clear" // Texto para limpiar búsqueda
          onClick={handleClearSearch} // Evento para limpiar
          disabled={loading} // Desactiva el botón mientras está cargando
          className="clear-button" // Clase global para el botón de limpiar
        />
      </div>
    </div>
  );
};

export default ProviderSearch;
