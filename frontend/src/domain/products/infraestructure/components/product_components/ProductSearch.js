import React, { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ProductService from "../../../domain/services/ProductService";
import CategoryService from "../../../domain/services/CategoryService";
import "./ProductSearch.css";

const ProductSearch = ({ onSearchResults, onClearTable }) => {
  const [searchType, setSearchType] = useState(""); // Tipo de búsqueda: vacío por defecto
  const [query, setQuery] = useState(""); // Valor del input de búsqueda o categoría seleccionada
  const [status, setStatus] = useState(""); // Estado seleccionado
  const [categories, setCategories] = useState([]); // Lista de categorías
  const [loading, setLoading] = useState(false); // Estado de carga
  const toast = useRef(null); // Referencia para Toast

  // Memorizar las instancias de servicio para evitar recreaciones innecesarias
  const productService = useMemo(() => new ProductService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);

  // Cargar categorías desde el backend
  const fetchCategories = useCallback(async () => {
    try {
      console.log("Fetching categories..."); // Debug
      const response = await categoryService.getAllCategories();
      const categoryOptions = response.map((category) => ({
        label: category.nombre,
        value: category.nombre,
      }));
      console.log("Fetched categories:", categoryOptions); // Debug
      setCategories(categoryOptions);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las categorías.",
        life: 3000,
      });
    }
  }, [categoryService]);


  // Manejo de cambio en tipo de búsqueda
  const handleSearchTypeChange = useCallback(
    (e) => {
      const type = e.value;
      setSearchType(type);
      setQuery(""); // Reinicia el valor del input o categoría seleccionada
      setStatus(""); // Reinicia el estado seleccionado
      if (type === "category") {
        fetchCategories(); // Cargar categorías si el tipo de búsqueda es "categoría"
      }
    },
    [fetchCategories]
  );

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
      let results = [];
      if (searchType === "name") {
        results = await productService.searchByName(query);
      } else if (searchType === "status") {
        results = await productService.searchByStatus(status);
      } else if (searchType === "category") {
        results = await productService.searchByCategory(query);
      }

      if (results.length > 0) {
        onSearchResults(results); // Actualizar resultados en el padre

        // Mostrar notificación de los resultados encontrados
        toast.current?.show({
          severity: "success",
          summary: "Búsqueda Exitosa",
          detail: `Se encontraron ${results.length} producto(s).`,
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "info",
          summary: "Sin Resultados",
          detail: "No se encontraron productos que coincidan con la búsqueda.",
          life: 3000,
        });
        onSearchResults([]); // Restablecer la lista si no hay resultados
      }
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error de Búsqueda",
        detail: "Ocurrió un error al intentar buscar productos.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [searchType, query, status, productService, onSearchResults]);

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setQuery("");
    setStatus("");
    setSearchType(""); // Restablecer el tipo de búsqueda
    onClearTable(); // Restablecer lista en ProductList
  };

  // Validación para habilitar o deshabilitar el botón Buscar
  const isSearchDisabled = useMemo(() => {
    if (loading) return true; // Bloquear mientras está cargando
    if (searchType === "name" || searchType === "category") {
      return query.trim() === ""; // Bloquear si no hay texto en el input o categoría seleccionada
    }
    if (searchType === "status") {
      return status === ""; // Bloquear si no se seleccionó un estado
    }
    return true; // Bloquear si no hay tipo de búsqueda seleccionado
  }, [searchType, query, status, loading]);

  return (
    <div className="product-search-section">
      <Toast ref={toast} />

      {/* Dropdown para seleccionar el tipo de búsqueda */}
      <div className="product-search-dropdown">
        <Dropdown
          data-testid="search-type-dropdown" // Agrega este atributo para facilitar las pruebas
          value={searchType}
          options={[
            { label: "Nombre", value: "name" },
            { label: "Estado", value: "status" },
            { label: "Categoría", value: "category" },
          ]}
          onChange={handleSearchTypeChange}
          placeholder="Elige el tipo de búsqueda"
        />

      </div>

      {/* Inputs dinámicos según el tipo de búsqueda */}
      {searchType === "status" ? (
        <div className="product-input">
          <Dropdown
            value={status}
            options={[
              { label: "Activo", value: "ACTIVE" },
              { label: "Descontinuado", value: "DISCONTINUED" },
              { label: "Sin Stock", value: "OUT_OF_STOCK" },
            ]}
            onChange={(e) => setStatus(e.value)}
            placeholder="Seleccione Estado"
            data-testid="status-dropdown" // Necesario para las pruebas
            disabled={!searchType || loading}
          />

        </div>
      ) : searchType === "category" ? (
        <div className="product-input">
          <Dropdown
            value={query}
            options={categories}
            onChange={(e) => setQuery(e.value)}
            placeholder="Seleccione Categoría"
            data-testid="category-dropdown"
            appendTo="self" // Asegura que las opciones están en el mismo contenedor
          />

        </div>
      ) : (
        <div className="product-input">
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
          label={loading ? "Buscando..." : "Buscar"} // Texto dinámico dependiendo del estado de carga
          icon="pi pi-search" // Icono de búsqueda
          onClick={handleSearch} // Evento para búsqueda
          disabled={isSearchDisabled} // Validación para deshabilitar el botón
          className="search-button" // Clase global para el botón de búsqueda
        />
        <Button
          label="Limpiar" // Texto del botón
          icon="pi pi-times" // Icono de limpiar
          onClick={handleClearSearch} // Evento para limpiar búsqueda
          disabled={loading} // Desactiva el botón durante la carga
          className="clear-button" // Clase global para el botón de limpiar
        />
      </div>
    </div>
  );
};

export default ProductSearch;
