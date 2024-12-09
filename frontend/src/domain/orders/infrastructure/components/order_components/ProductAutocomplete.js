import React, { useState, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import ProductService from "../../../../products/domain/services/ProductService"; // Asegúrate de ajustar la ruta
import "./ProductAutocomplete.css";

const ProductAutocomplete = ({ onAddProduct }) => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [loading, setLoading] = useState(false);

  const productService = useMemo(() => new ProductService(), []);

  const handleSearch = async (value) => {
    setQuery(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
      setIsNewProduct(false);
      return;
    }

    setLoading(true);

    try {
      // Llama al servicio para obtener los productos que coincidan
      const response = await productService.searchProducts(value); // Método de búsqueda en ProductService
      setFilteredProducts(response);

      // Detecta si no hay coincidencias
      setIsNewProduct(response.length === 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    onAddProduct(product);
    setQuery(""); // Limpia el campo
    setFilteredProducts([]);
    setIsNewProduct(false);
  };

  return (
    <div className="product-autocomplete">
      <InputText
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search or add a product"
        className="product-input"
      />

      {loading && <div className="loading">Loading...</div>}

      {query && !loading && (
        <ul className="suggestions-list">
          {/* Lista de coincidencias */}
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className="suggestion-item"
            >
              {product.name} (Stock: {product.stock || 0})
            </li>
          ))}

          {/* Opción para agregar un producto nuevo */}
          {isNewProduct && (
            <li className="new-product">
              <Button
                label={`Add new product: "${query}"`}
                onClick={() =>
                  handleSelectProduct({ name: query, quantity: 1, id: null })
                }
                className="add-new-product"
              />
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProductAutocomplete;
