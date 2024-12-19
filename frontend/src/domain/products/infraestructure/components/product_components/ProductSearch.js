import React, { useState, useRef, useCallback, useMemo } from "react"; // Importación de hooks de React
import { Button } from "primereact/button"; // Importación del botón de PrimeReact
import { InputText } from "primereact/inputtext"; // Importación del campo de texto de PrimeReact
import { Dropdown } from "primereact/dropdown"; // Importación del dropdown de PrimeReact
import { Toast } from "primereact/toast"; // Importación de notificaciones de PrimeReact
import ProductService from "../../../domain/services/ProductService"; // Servicio para manejar productos
import CategoryService from "../../../domain/services/CategoryService"; // Servicio para manejar categorías
import "./ProductSearch.css"; // Importación de estilos CSS

// Componente ProductSearch
const ProductSearch = ({ onSearchResults, onClearTable }) => {
  // Definición de los estados del componente
  const [searchType, setSearchType] = useState(""); // Tipo de búsqueda: nombre, estado o categoría
  const [query, setQuery] = useState(""); // Valor de búsqueda (nombre, código o categoría)
  const [status, setStatus] = useState(""); // Estado seleccionado (activo, sin stock, etc.)
  const [categories, setCategories] = useState([]); // Lista de categorías disponibles
  const [loading, setLoading] = useState(false); // Indicador de carga mientras se busca
  const toast = useRef(null); // Referencia al componente Toast para mostrar notificaciones

  // Memorizar las instancias de los servicios para optimizar la renderización
  const productService = useMemo(() => new ProductService(), []); // Instancia del servicio de productos
  const categoryService = useMemo(() => new CategoryService(), []); // Instancia del servicio de categorías

  // Función para cargar las categorías disponibles
  const fetchCategories = useCallback(async () => {
    try {
      console.log("Fetching categories..."); // Debug para verificar el proceso
      const response = await categoryService.getAllCategories(); // Solicita todas las categorías al backend
      const categoryOptions = response.map((category) => ({
        label: category.nombre, // Etiqueta para cada opción en el dropdown
        value: category.nombre, // Valor de la opción, utilizado para filtrar por categoría
      }));
      console.log("Fetched categories:", categoryOptions); // Debug para verificar las categorías cargadas
      setCategories(categoryOptions); // Actualiza el estado con las categorías obtenidas
    } catch (error) {
      console.error("Error al cargar categorías:", error); // Manejo de error si la carga de categorías falla
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las categorías.", // Muestra un mensaje de error
        life: 3000,
      });
    }
  }, [categoryService]); // Depende del servicio de categorías

  // Función para manejar el cambio en el tipo de búsqueda seleccionado
  const handleSearchTypeChange = useCallback(
    (e) => {
      const type = e.value;
      setSearchType(type); // Actualiza el tipo de búsqueda
      setQuery(""); // Limpia el valor de la búsqueda
      setStatus(""); // Resetea el estado de búsqueda
      if (type === "category") {
        fetchCategories(); // Si el tipo de búsqueda es "categoría", carga las categorías
      }
    },
    [fetchCategories] // Dependencia de la función fetchCategories
  );

  // Función para realizar la búsqueda en función del tipo de búsqueda seleccionado
  const handleSearch = useCallback(async () => {
    if (!searchType) {
      toast.current?.show({
        severity: "warn", // Muestra una advertencia si no se ha seleccionado un tipo de búsqueda
        summary: "Tipo de Búsqueda Requerido",
        detail: "Por favor, seleccione un tipo de búsqueda.",
        life: 3000,
      });
      return;
    }

    setLoading(true); // Activa el estado de carga
    try {
      let results = []; // Variable para almacenar los resultados de la búsqueda
      if (searchType === "name") {
        results = await productService.searchByName(query); // Búsqueda por nombre de producto
      } else if (searchType === "status") {
        results = await productService.searchByStatus(status); // Búsqueda por estado de producto
      } else if (searchType === "category") {
        results = await productService.searchByCategory(query); // Búsqueda por categoría
      }

      if (results.length > 0) {
        onSearchResults(results); // Pasa los resultados al componente padre

        // Muestra una notificación de éxito con el número de productos encontrados
        toast.current?.show({
          severity: "success",
          summary: "Búsqueda Exitosa",
          detail: `Se encontraron ${results.length} producto(s).`,
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "info", // Muestra una notificación si no se encuentran productos
          summary: "Sin Resultados",
          detail: "No se encontraron productos que coincidan con la búsqueda.",
          life: 3000,
        });
        onSearchResults([]); // Restablece la lista de productos si no se encuentran resultados
      }
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error); // Manejo de errores durante la búsqueda
      toast.current?.show({
        severity: "error", // Muestra un mensaje de error si ocurre algún problema en la búsqueda
        summary: "Error de Búsqueda",
        detail: "Ocurrió un error al intentar buscar productos.",
        life: 3000,
      });
    } finally {
      setLoading(false); // Desactiva el estado de carga después de completar la búsqueda
    }
  }, [searchType, query, status, productService, onSearchResults]); // Dependencias de la búsqueda


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
