import React, { useState } from "react";
import ProductService from "../../../domain/services/ProductService";
import { ProductDTO } from "../../dto/ProductDTO";

const ProductSearch = ({ onSearchResults }) => {
  const [searchType, setSearchType] = useState("name");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const productService = new ProductService();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      let response = [];
      if (searchType === "name") {
        response = await productService.findByName(query, 0, 15);
      } else if (searchType === "status") {
        response = await productService.findByStatus(status, 0, 15);
      } else if (searchType === "category") {
        response = await productService.findByCategoryName(query, 0, 15);
      }

      // Verificar y validar respuesta
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

        // Pasar los resultados al componente padre
        onSearchResults(products);
      } else {
        setError("No products found or invalid response structure.");
        onSearchResults([]); // Limpiar resultados en caso de error
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error fetching results.");
      onSearchResults([]); // Limpiar resultados en error
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar los campos de búsqueda
  const handleClearSearch = () => {
    setQuery(""); // Limpiar query de búsqueda
    setStatus("ACTIVE"); // Resetear estado a 'ACTIVE'
    setError(null); // Limpiar cualquier error
    onSearchResults([]); // Limpiar los productos filtrados
  };

  return (
    <div>
      <h1>Product Search</h1>
      <div>
        <label>
          Search By:
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="category">Category Name</option>
          </select>
        </label>
      </div>

      {/* Mostrar input o select dependiendo del tipo de búsqueda */}
      {searchType === "status" ? (
        <div>
          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="DISCONTINUED">Discontinued</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </label>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder={`Search by ${searchType}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {/* Botón para ejecutar la búsqueda */}
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {/* Botón para limpiar los campos de búsqueda */}
      <button onClick={handleClearSearch} disabled={loading}>
        Clear
      </button>

      {/* Mostrar mensajes de error */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ProductSearch;
