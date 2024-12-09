import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProductForm from "./product_components/ProductForm";
import ProductList from "./product_components/ProductList";
import ProductSearch from "./product_components/ProductSearch";
import CategoryForm from "./category_components/CategoryForm";
import CategoryList from "./category_components/CategoryList";
import CategorySearch from "./category_components/CategorySearch";
import ProductService from "../../domain/services/ProductService";
import CategoryService from "../../domain/services/CategoryService";
import { Button } from "primereact/button";
import "./ParentComponentProduct.css";

const ParentComponentProduct = () => {
  const [activeSection, setActiveSection] = useState("products"); // "products" o "categories"
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // Control de visibilidad del formulario

  const productService = useMemo(() => new ProductService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);

  // Obtener productos
  const fetchAllProducts = useCallback(async () => {
    try {
      const fetchedProducts = await productService.getAllProducts();
      setAllProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [productService]);

  // Obtener categorías
  const fetchAllCategories = useCallback(async () => {
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setAllCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [categoryService]);

  // Cambiar entre productos y categorías
  useEffect(() => {
    if (activeSection === "products") {
      fetchAllProducts();
    } else {
      fetchAllCategories();
    }
  }, [activeSection, fetchAllProducts, fetchAllCategories]);

  const handleAddProduct = () => {
    setSelectedProductId(null);
    setIsFormVisible(true); // Mostrar formulario de productos
  };

  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
    setIsFormVisible(true); // Mostrar formulario de productos
  };

  const handleAddCategory = () => {
    setSelectedCategoryId(null);
    setIsFormVisible(true); // Mostrar formulario de categorías
  };

  const handleEditCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsFormVisible(true); // Mostrar formulario de categorías
  };

  const handleCancelForm = () => {
    setIsFormVisible(false); // Solo oculta el formulario
  };  

  const handleSwitchSection = (section) => {
    setActiveSection(section);
    setIsFormVisible(false); // Ocultar cualquier formulario al cambiar de sección
  };

  return (
    <div className="productos-container">
    <h2>{activeSection === "products" ? "Gestión de Productos" : "Gestión de Categorías"}</h2>
  
    {/* Botones para alternar entre productos y categorías */}
    <div className="button-container products-and-categories">
      <Button
        label="Ver Productos"
        icon="pi pi-box"
        className="p-button view-products-button"
        onClick={() => handleSwitchSection("products")}
      />
      <Button
        label="Ver Categorías"
        icon="pi pi-tags"
        className="p-button view-categories-button"
        onClick={() => handleSwitchSection("categories")}
      />
    </div>
  
    {/* Sección de productos */}
    {activeSection === "products" && (
      <section className="products-section">
        <ProductSearch products={allProducts} onSearchResults={setAllProducts} />
        <div className="button-container">
          <Button
            label="Agregar Producto"
            icon="pi pi-plus"
            className="p-button-success add-product-button"
            onClick={handleAddProduct}
          />
        </div>
        {isFormVisible ? (
          <ProductForm
            productId={selectedProductId}
            onProductSaved={fetchAllProducts}
            onCancel={handleCancelForm}
          />
        ) : (
          <ProductList onEditProduct={handleEditProduct} products={allProducts} />
        )}
      </section>
    )}
  
    {/* Sección de categorías */}
    {activeSection === "categories" && (
      <section className="categories-section">
        <CategorySearch categories={allCategories} onSearchResults={setAllCategories} />
        <div className="button-container">
          <Button
            label="Agregar Categoría"
            icon="pi pi-plus"
            className="p-button-info add-category-button"
            onClick={handleAddCategory}
          />
        </div>
        {isFormVisible ? (
          <CategoryForm
          categoryId={selectedCategoryId}
          onCategorySaved={fetchAllCategories} // Actualiza categorías después de guardar
          onCancel={handleCancelForm} // Cancela sin errores
        />        
        ) : (
          <CategoryList onEditCategory={handleEditCategory} />
        )}
      </section>
    )}
  </div>
  
  );
};

export default ParentComponentProduct;
