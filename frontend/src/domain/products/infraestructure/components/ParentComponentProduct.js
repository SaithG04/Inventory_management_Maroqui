import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ProductForm from "./product_components/ProductForm";
import ProductList from "./product_components/ProductList";
import ProductSearch from "./product_components/ProductSearch";
import CategoryForm from "./category_components/CategoryForm";
import CategoryList from "./category_components/CategoryList";
import CategorySearch from "./category_components/CategorySearch";
import ProductService from "../../domain/services/ProductService";
import CategoryService from "../../domain/services/CategoryService";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "./ParentComponentProduct.css";

const ParentComponentProduct = () => {
  const [activeSection, setActiveSection] = useState("products");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toast = useRef(null); // Ref para el Toast
  const productService = useMemo(() => new ProductService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);

  const fetchAllProducts = useCallback(async () => {
    try {
      const fetchedProducts = await productService.getAllProducts();
      setAllProducts(fetchedProducts);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener los productos.",
      });
    }
  }, [productService]);

  const fetchAllCategories = useCallback(async () => {
    try {
      const categories = await categoryService.getAllCategories();
      setAllCategories(categories || []);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener las categorías.",
      });
    }
  }, [categoryService]);

  useEffect(() => {
    if (activeSection === "products") {
      fetchAllProducts();
    } else {
      fetchAllCategories();
    }
  }, [activeSection, fetchAllProducts, fetchAllCategories]);

  const handleAddProduct = () => {
    setSelectedProductId(null);
    setIsFormVisible(true);
    toast.current.show({
      severity: "info",
      summary: "Formulario de Productos",
      detail: "Formulario de agregar producto abierto.",
    });
  };

  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
    setIsFormVisible(true);
    toast.current.show({
      severity: "info",
      summary: "Editar Producto",
      detail: "Editando el producto seleccionado.",
    });
  };

  const handleAddCategory = () => {
    setSelectedCategoryId(null);
    setSelectedCategoryData(null);
    setIsFormVisible(true);
    toast.current.show({
      severity: "info",
      summary: "Formulario de Categorías",
      detail: "Formulario de agregar categoría abierto.",
    });
  };

  const handleEditCategory = (category) => {
    setSelectedCategoryId(category.id_categoria);
    setSelectedCategoryData({
      name: category.nombre,
      description: category.descripcion,
      status: category.estado,
    });
    setIsFormVisible(true);
    toast.current.show({
      severity: "info",
      summary: "Editar Categoría",
      detail: `Editando la categoría "${category.nombre}".`,
    });
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    toast.current.show({
      severity: "info",
      summary: "Formulario Cerrado",
      detail: "El formulario fue cerrado sin guardar cambios.",
    });
  };

  const handleCategorySaved = () => {
    fetchAllCategories();
    setIsFormVisible(false);
    toast.current.show({
      severity: "success",
      summary: "Categoría Guardada",
      detail: "La categoría fue guardada correctamente.",
    });
  };

   // Función para eliminar una categoría
   const handleDeleteCategory = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      toast.current.show({
        severity: "success",
        summary: "Categoría Eliminada",
        detail: "La categoría fue eliminada correctamente.",
      });
      fetchAllCategories(); // Refresca la lista de categorías
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar la categoría.",
      });
      console.error("Error deleting category:", error);
    }
  };

  const handleSwitchSection = (section) => {
    setActiveSection(section);
    setIsFormVisible(false);
    toast.current.show({
      severity: "info",
      summary: "Cambio de Sección",
      detail: `Sección activa: ${section === "products" ? "Productos" : "Categorías"}.`,
    });
  };

  return (
    <div className="productos-container">
      <Toast ref={toast} />
      <h2>{activeSection === "products" ? "Gestión de Productos" : "Gestión de Categorías"}</h2>
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
              initialData={selectedCategoryData}
              onCategorySaved={handleCategorySaved}
              onCancel={handleCancelForm}
            />
          ) : (
            <CategoryList
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory} // Pasa la función al hijo
              refreshTrigger={allCategories}
            />
          )}
        </section>
      )}
    </div>
  );
};

export default ParentComponentProduct;