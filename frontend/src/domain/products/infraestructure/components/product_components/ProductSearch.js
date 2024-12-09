import React, { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ProductService from "../../../domain/services/ProductService";
import { ProductDTO } from "../../dto/ProductDTO";
import "./ProductSearch.css";

const ProductSearch = ({ onSearchResults }) => {
  const [searchType, setSearchType] = useState("name");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null); // Referencia para Toast

  // Memorizar la instancia del servicio para evitar recreaciones innecesarias
  const productService = useMemo(() => new ProductService(), []);

  // Manejo de búsqueda
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      let response = [];

      // Realizar la búsqueda según el tipo seleccionado
      if (searchType === "name") {
        response = await productService.findByName(query, 0, 15);
      } else if (searchType === "status") {
        response = await productService.findByStatus(status, 0, 15);
      } else if (searchType === "category") {
        response = await productService.findByCategoryName(query, 0, 15);
      }

      // Validar y mapear resultados
      if (response && Array.isArray(response.data)) {
        const products = response.data
          .map((productData) => {
            try {
              const productDTO = new ProductDTO(productData);
              return productDTO.toDomain();
            } catch (err) {
              console.error("Error converting product to domain:", err);
              return null;
            }
          })
          .filter((product) => product !== null);

        // Enviar resultados al componente padre
        onSearchResults(products);
      } else {
        toast.current.show({
          severity: "warn",
          summary: "No Products Found",
          detail: "No products match the search criteria.",
          life: 3000,
        });
        onSearchResults([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.current.show({
        severity: "error",
        summary: "Search Error",
        detail: "Failed to fetch products. Please try again.",
        life: 3000,
      });
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchType, query, status, productService, onSearchResults]);

  // Manejo de limpieza de búsqueda
  const handleClearSearch = () => {
    setQuery("");
    setStatus("ACTIVE");
    onSearchResults([]);
  };

  return (
    <div className="product-search-section">
      <Toast ref={toast} />

      {/* Dropdown para seleccionar el tipo de búsqueda */}
      <div className="product-search-dropdown">
        <Dropdown
          value={searchType}
          options={[
            { label: "Name", value: "name" },
            { label: "Status", value: "status" },
            { label: "Category", value: "category" },
          ]}
          onChange={(e) => setSearchType(e.value)}
          placeholder="Select Search Type"
        />
      </div>

      {/* Inputs dinámicos según el tipo de búsqueda */}
      {searchType === "status" ? (
        <div className="product-input">
          <Dropdown
            value={status}
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Discontinued", value: "DISCONTINUED" },
              { label: "Out of Stock", value: "OUT_OF_STOCK" },
            ]}
            onChange={(e) => setStatus(e.value)}
            placeholder="Select Status"
          />
        </div>
      ) : (
        <div className="product-input">
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

export default ProductSearch;
