import React, { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import CategoryService from "../../../domain/services/CategoryService";
import "./CategorySearch.css";

const CategorySearch = ({ onSearchResults, onClearTable }) => {
  const [searchType, setSearchType] = useState(""); // Tipo de búsqueda vacío por defecto
  const [query, setQuery] = useState(""); // Valor del input de búsqueda
  const [status, setStatus] = useState(""); // Estado seleccionado
  const [loading, setLoading] = useState(false); // Estado de carga
  const toast = useRef(null); // Referencia para Toast

  const categoryService = useMemo(() => new CategoryService(), []);

  // Manejo de búsqueda
  const handleSearch = useCallback(async () => {
    if (!searchType) {
      toast.current?.show({
        severity: "warn",
        summary: "Tipo de Búsqueda Requerido",
        detail: "Por favor, seleccione un tipo de búsqueda.",
        life: 3000,
      });
      return;
    }
  
    setLoading(true);
    try {
      let response = [];
      if (searchType === "name") {
        const result = await categoryService.getCategoryByName(query);
        response = result.content || []; // Extrae las categorías del campo content
      } else if (searchType === "status") {
        const result = await categoryService.getCategoryByStatus(status);
        response = result.content || []; // Extrae las categorías del campo content
      }
  
      if (response.length > 0) {
        onSearchResults(response); // Actualizar resultados en el padre
        toast.current?.show({
          severity: "success",
          summary: "Búsqueda Exitosa",
          detail: `Se encontraron ${response.length} categoría(s).`,
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "info",
          summary: "Sin Resultados",
          detail: "No se encontraron categorías que coincidan con la búsqueda.",
          life: 3000,
        });
        onSearchResults([]); // Envía un array vacío al padre si no hay resultados
      }
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error de Búsqueda",
        detail: "Ocurrió un error al intentar buscar categorías.",
        life: 3000,
      });
      onSearchResults([]); // Reinicia la tabla en caso de error
    } finally {
      setLoading(false);
    }
  }, [searchType, query, status, categoryService, onSearchResults]);
  
  

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setQuery("");
    setStatus("");
    setSearchType(""); // Restablecer el tipo de búsqueda
    onClearTable(); // Restablecer lista en CategoryList
  };

  // Validación para habilitar el botón Buscar
  const isSearchDisabled = useMemo(() => {
    if (loading) return true;
    if (searchType === "name") return query.trim() === "";
    if (searchType === "status") return status === "";
    return true;
  }, [searchType, query, status, loading]);

  return (
    <div className="category-search-section">
      <Toast ref={toast} />

      {/* Dropdown para seleccionar el tipo de búsqueda */}
      <div className="category-search-dropdown">
        <Dropdown
          value={searchType}
          options={[
            { label: "Nombre", value: "name" },
            { label: "Estado", value: "status" },
          ]}
          onChange={(e) => setSearchType(e.value)}
          placeholder="Seleccione Tipo de Búsqueda"
        />
      </div>

      {/* Inputs dinámicos según el tipo de búsqueda */}
      {searchType === "status" ? (
        <div className="category-input">
          <Dropdown
            value={status}
            options={[
              { label: "Activo", value: "ACTIVE" },
              { label: "Inactivo", value: "INACTIVE" },
            ]}
            onChange={(e) => setStatus(e.value)}
            placeholder="Seleccione Estado"
            disabled={!searchType || loading} // Bloquear si no hay tipo seleccionado o está cargando
          />
        </div>
      ) : (
        <div className="category-input">
          <InputText
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por Nombre"
            disabled={!searchType || loading} // Bloquear si no hay tipo seleccionado o está cargando
          />
        </div>
      )}

      {/* Botones de acción */}
      <div className="search-clear-buttons">
        <Button
          label={loading ? "Buscando..." : "Buscar"}
          icon="pi pi-search"
          onClick={handleSearch}
          disabled={isSearchDisabled}
          className="search-button"
        />
        <Button
          label="Limpiar"
          icon="pi pi-times"
          onClick={handleClearSearch}
          disabled={loading}
          className="clear-button"
        />
      </div>
    </div>
  );
};

export default CategorySearch;
