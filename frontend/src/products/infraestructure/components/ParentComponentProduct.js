import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProductForm from "./product_components/ProductForm";
import ProductList from "./product_components/ProductList";
import ProductSearch from "./product_components/ProductSearch"; // Importar el componente de búsqueda
import ProductService from "../../domain/services/ProductService";
import './ParentComponentProduct.css'; // Asegúrate de importar el archivo CSS

const ParentComponentProduct = () => {
  const [selectedProductId, setSelectedProductId] = useState(null); // Para saber qué producto editar
  const [allProducts, setAllProducts] = useState([]); // Para almacenar todos los productos

  // Memorizar la creación de 'productService' para evitar su recreación en cada render
  const productService = useMemo(() => new ProductService(), []);

  // Función para seleccionar un producto para editar
  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
  };

  // Función para limpiar la selección de producto (para agregar un nuevo producto)
  const handleAddProduct = () => {
    setSelectedProductId(null);
  };

  // Función para obtener todos los productos, envuelta en useCallback
  const fetchAllProducts = useCallback(async () => {
    const response = await productService.getAllProducts();
    const fetchedProducts = response?.data || []; // Si data es null/undefined, usar un array vacío
    setAllProducts(fetchedProducts); // Guardamos todos los productos
  }, [productService]);

  const handleSearchResults = (results) => {
    // Lógica para manejar los resultados de búsqueda
    setAllProducts(results);
  };

  useEffect(() => {
    fetchAllProducts(); // Cargar productos al inicio
  }, [fetchAllProducts]);

  return (
    <div className="productos-container">
      <h2>Product Management</h2>

      {/* Componente de búsqueda de productos */}
      <ProductSearch
        products={allProducts}
        onSearchResults={handleSearchResults}
      />

      {/* Contenedor de botones para agregar, cancelar o crear categorías */}
      <div className="button-container products-and-categories">
        <button
          className="p-button add-product-button"
          onClick={handleAddProduct}
        >
          <i className="pi pi-plus" /> Add New Product
        </button>
      </div>

      {/* Formulario para agregar/editar producto */}
      <div className="add-product-form">
        <ProductForm
          productId={selectedProductId}
          onProductSaved={fetchAllProducts} // Listar nuevamente
        />
      </div>

      {/* Lista de productos */}
      <div className="productos-list">
        <ProductList
          onEditProduct={handleEditProduct}
          products={allProducts} // Pasar la lista completa de productos
        />
      </div>
    </div>
  );
};

export default ParentComponentProduct;
