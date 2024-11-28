import React, { useState, useEffect } from "react";
import ProductForm from "./product_components/ProductForm";
import ProductList from "./product_components/ProductList";
import ProductSearch from "./product_components/ProductSearch"; // Importar el componente de búsqueda
import ProductService from "../../domain/services/ProductService";

const ParentComponentProduct = () => {
  const [selectedProductId, setSelectedProductId] = useState(null); // Para saber qué producto editar
  const [refreshTrigger, setRefreshTrigger] = useState(false); // Estado para forzar recarga
  const [allProducts, setAllProducts] = useState([]); // Para almacenar todos los productos
  const productService = new ProductService();

  // Función para seleccionar un producto para editar
  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
  };

  // Función para limpiar la selección de producto (para agregar un nuevo producto)
  const handleAddProduct = () => {
    setSelectedProductId(null);
  };

  // Función para obtener todos los productos
  const fetchAllProducts = async () => {
    const response = await productService.getAllProducts();
    const fetchedProducts = response?.data || []; // Si data es null/undefined, usar un array vacío
    setAllProducts(fetchedProducts); // Guardamos todos los productos
  };

  const handleSearchResults = (results) => {
    // Lógica para manejar los resultados de búsqueda
    setAllProducts(results);
  };
  
  useEffect(() => {
    fetchAllProducts(); // Cargar productos al inicio
  }, []);

  return (
    <div>
      <h1>Product Management</h1>

      {/* Componente de búsqueda de productos */}
      <ProductSearch
        products={allProducts}
        onSearchResults={handleSearchResults}
      />

      {/* Botón para agregar nuevo producto */}
      <button onClick={handleAddProduct}>Add New Product</button>

      {/* Formulario para agregar/editar producto */}
      <ProductForm
        productId={selectedProductId}
        onProductSaved={fetchAllProducts} // Listar nuevamente
      />

      {/* Lista de productos */}
      <ProductList
        onEditProduct={handleEditProduct}
        refreshTrigger={refreshTrigger}
        products={allProducts} // Pasar la lista completa de productos
      />
    </div>
  );
};

export default ParentComponentProduct;
