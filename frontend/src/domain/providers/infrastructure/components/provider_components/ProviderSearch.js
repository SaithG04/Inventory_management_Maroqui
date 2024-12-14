import React, { useState, useRef, useMemo } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ProviderService from "../../../domain/services/ProviderService";
import "./ProviderSearch.css";

const ProviderSearch = ({ onSearchResults, onClearSearch }) => {
  const [searchType, setSearchType] = useState(null); // Estado inicial sin selección
  const [query, setQuery] = useState(""); // Valor de búsqueda
  const [status, setStatus] = useState("ACTIVE"); // Estado inicial
  const [loading, setLoading] = useState(false); // Indicador de carga
  const toast = useRef(null); // Referencia para mostrar mensajes Toast

  // Memorizar la instancia de ProviderService
  const providerService = useMemo(() => new ProviderService(), []);

  // Función de búsqueda
  const handleSearch = async () => {
    setLoading(true);

    try {
      let response = [];

      if (searchType === "name" && query) {
        response = await providerService.findByName(query, 0, 15); // Búsqueda por nombre
      } else if (searchType === "status" && status) {
        response = await providerService.findByStatus(status, 0, 15); // Búsqueda por estado
      }

      if (Array.isArray(response) && response.length > 0) {
        onSearchResults(response); // Pasar resultados al componente padre
      } else {
        toast.current.show({
          severity: "warn",
          summary: "Sin resultados",
          detail: "No se encontraron proveedores.",
          life: 3000,
        });
        onSearchResults([]); // Vaciar resultados si no se encuentra nada
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Ocurrió un error al obtener los resultados. Inténtelo nuevamente.",
        life: 3000,
      });
      onSearchResults([]); // Vaciar resultados en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar el formulario
  const handleClearSearch = () => {
    console.log("Clear button clicked");
    console.log("onClearSearch:", onClearSearch); // Verifica el valor de `onClearSearch`
    setQuery("");
    setStatus("ACTIVE");
    setSearchType(null);
    onClearSearch();
  };

  return (
    <div className="provider-search-section">
      <Toast ref={toast} />

      <div className="provider-search-dropdown">
        <Dropdown
          value={searchType}
          options={[
            { label: "Nombre", value: "name", dataTestId: "search-type-name" },
            { label: "Estado", value: "status", dataTestId: "search-type-status" },
          ]}
          onChange={(e) => setSearchType(e.value)}
          placeholder="Seleccione Tipo de Búsqueda"
          data-testid="search-type-dropdown"
          itemTemplate={(option) => (
            <span data-testid={option.dataTestId}>{option.label}</span>
          )}
        />
      </div>

      <div className="provider-input">
        {searchType === "status" && (
          <Dropdown
            value={status}
            options={[
              { label: "Activo", value: "ACTIVE" },
              { label: "Inactivo", value: "INACTIVE" },
            ]}
            onChange={(e) => setStatus(e.value)}
            placeholder="Select Status"
            data-testid="status-dropdown"
            optionLabel="label"
            aria-label="Status Dropdown"
          />
        )}
        {(!searchType || searchType === "name") && (
          <InputText
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter provider name"
            aria-label="Search by Name"
            className="name-input"
            disabled={!searchType}
          />
        )}
      </div>

      <div className="search-clear-buttons">
        <Button
          label={loading ? "Cargando..." : "Buscar"}
          onClick={handleSearch} // Llama a handleSearch
          disabled={loading || !searchType || (searchType === "name" && !query.trim())}
          className="search-button"
        />
        <Button
          label="Limpiar"
          onClick={handleClearSearch} // Esto sí debe llamar a handleClearSearch
          disabled={loading}
          className="clear-button"
        />
      </div>
    </div>
  );
};

export default ProviderSearch;
