import React, { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import CategoryService from "../../../domain/services/CategoryService";
import { CategoryDTO } from "../../dto/CategoryDTO";
import "./CategorySearch.css";

const CategorySearch = ({ onSearchResults }) => {
  const [searchType, setSearchType] = useState("name");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null); // Referencia para Toast

  // Memorizar la instancia del servicio para evitar recreaciones innecesarias
  const categoryService = useMemo(() => new CategoryService(), []);

  // Manejo de búsqueda
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      let response = [];

      // Realizar la búsqueda según el tipo seleccionado
      if (searchType === "name") {
        response = await categoryService.getAllCategories();
        response = response.filter((category) =>
          category.name.toLowerCase().includes(query.toLowerCase())
        );
      } else if (searchType === "status") {
        response = await categoryService.getAllCategories();
        response = response.filter((category) => category.status === status);
      }

      // Validar y mapear resultados
      const categories = response
        .map((categoryData) => {
          try {
            const categoryDTO = new CategoryDTO(categoryData);
            return categoryDTO.toDomain();
          } catch (err) {
            console.error("Error converting category to domain:", err);
            return null;
          }
        })
        .filter((category) => category !== null);

      // Enviar resultados al componente padre
      if (categories.length > 0) {
        onSearchResults(categories);
      } else {
        toast.current.show({
          severity: "warn",
          summary: "No Categories Found",
          detail: "No categories match the search criteria.",
          life: 3000,
        });
        onSearchResults([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.current.show({
        severity: "error",
        summary: "Search Error",
        detail: "Failed to fetch categories. Please try again.",
        life: 3000,
      });
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchType, query, status, categoryService, onSearchResults]);

  // Manejo de limpieza de búsqueda
  const handleClearSearch = () => {
    setQuery("");
    setStatus("ACTIVE");
    onSearchResults([]);
  };

  return (
    <div className="category-search-section">
      <Toast ref={toast} />

      {/* Dropdown para seleccionar el tipo de búsqueda */}
      <div className="category-search-dropdown">
        <Dropdown
          value={searchType}
          options={[
            { label: "Name", value: "name" },
            { label: "Status", value: "status" },
          ]}
          onChange={(e) => setSearchType(e.value)}
          placeholder="Select Search Type"
        />
      </div>

      {/* Inputs dinámicos según el tipo de búsqueda */}
      {searchType === "status" ? (
        <div className="category-input">
          <Dropdown
            value={status}
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
            onChange={(e) => setStatus(e.value)}
            placeholder="Select Status"
          />
        </div>
      ) : (
        <div className="category-input">
          <InputText
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search by ${searchType}`}
          />
        </div>
      )}

      {/* Botones de acción */}
      <div className="search-clear-buttons">
        <Button
          label={loading ? "Searching..." : "Search"} // Texto dinámico dependiendo del estado de carga
          icon="pi pi-search" // Icono de búsqueda
          onClick={handleSearch} // Evento para búsqueda
          disabled={loading} // Desactiva el botón durante la carga
          className="search-button" // Clase global para el botón de búsqueda
        />
        <Button
          label="Clear" // Texto del botón
          icon="pi pi-times" // Icono de limpiar
          onClick={handleClearSearch} // Evento para limpiar búsqueda
          disabled={loading} // Desactiva el botón durante la carga
          className="clear-button" // Clase global para el botón de limpiar
        />
      </div>

    </div>
  );
};

export default CategorySearch;
