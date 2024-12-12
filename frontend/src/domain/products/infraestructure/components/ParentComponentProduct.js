import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ProductForm from "./product_components/ProductForm";
import ProductList from "./product_components/ProductList";
import ProductSearch from "./product_components/ProductSearch";
import CategoryForm from "./category_components/CategoryForm";
import CategoryList from "./category_components/CategoryList";

// Componentes relacionados a relaciones producto-proveedor
import ProductProviderList from "./product_provider_components/ProductProviderList";
import ProductProviderForm from "./product_provider_components/ProductProviderForm";
import ProductProviderSearch from "./product_provider_components/ProductProviderSearch";

import ProductProviderService from "../../domain/services/ProductProviderService";
import ProviderService from "../../../providers/domain/services/ProviderService"; // Nuevo servicio para proveedores
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

  // Estados para relaciones producto-proveedor
  const [productProviders, setProductProviders] = useState([]); // Relaciones producto-proveedor
  const [providers, setProviders] = useState([]); // Lista de proveedores
  const [selectedProvider, setSelectedProvider] = useState(null); // Proveedor seleccionado
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Estados para productos y categorías
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const toast = useRef(null);

  // Servicios
  const productProviderService = useMemo(() => new ProductProviderService(), []);
  const providerService = useMemo(() => new ProviderService(), []);
  const productService = useMemo(() => new ProductService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);


  // === PRODUCTOS ===
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

  // === CATEGORÍAS ===
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

  // === RELACIÓN PRODUCTO-PROVEEDOR ===
  // Obtener todos los proveedores al montar el componente
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await providerService.getAllProviders(0, 100); // Paginar si es necesario
        setProviders(response.data.content || []);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los proveedores.",
        });
      }
    };

    fetchProviders();
  }, [providerService]);

  // Obtener relaciones producto-proveedor para un proveedor específico
  const fetchProductProviders = async (supplierId) => {
    console.log("ID del proveedor seleccionado:", supplierId); // Debug: Verificar el ID del proveedor
  
    try {
      const relations = await productProviderService.getProductsBySupplierId(supplierId);
      console.log("Relaciones devueltas por el backend:", relations); // Debug: Verificar relaciones obtenidas
  
      const enrichedRelations = relations.map((relation) => ({
        ...relation,
        productName: allProducts.find((p) => p.id === relation.productId)?.name || "Producto Desconocido",
        providerName: providers.find((prov) => prov.id === relation.supplierId)?.name || "Proveedor Desconocido",
      }));
  
      console.log("Relaciones enriquecidas:", enrichedRelations); // Debug: Verificar relaciones después del enriquecimiento
  
      setProductProviders(enrichedRelations); // Actualizar el estado con los datos enriquecidos
    } catch (error) {
      console.error("Error al obtener relaciones:", error); // Debug: Capturar cualquier error
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las relaciones.",
      });
    }
  };
  


  // Manejar la selección de un proveedor
  const handleProviderSelection = (provider) => {
    setSelectedProvider(provider);
    if (provider) {
      fetchProductProviders(provider.id); // Cargar relaciones para el proveedor seleccionado
    } else {
      setProductProviders([]);
    }
  };

  // Agregar una nueva relación producto-proveedor
  const handleAddRelation = () => {
    setIsFormVisible(true);
  };

  // Guardar una relación producto-proveedor
  const handleRelationSaved = () => {
    if (selectedProvider) {
      fetchProductProviders(selectedProvider.id); // Actualizar relaciones
    }
    setIsFormVisible(false);
    toast.current.show({
      severity: "success",
      summary: "Relación Guardada",
      detail: "La relación Producto-Proveedor fue guardada correctamente.",
    });
  };

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

  // Cambiar sección activa
  const handleSwitchSection = (section) => {
    setActiveSection(section);
    setIsFormVisible(false);

    toast.current.show({
      severity: "info",
      summary: "Cambio de Sección",
      detail: `Sección activa: ${section === "products"
        ? "Productos"
        : section === "categories"
          ? "Categorías"
          : "Productos y Proveedores"
        }.`,
    });
  };


  return (
    <div className="productos-container">
      <Toast ref={toast} />
      <h2>
        {activeSection === "products"
          ? "Gestión de Productos"
          : activeSection === "categories"
            ? "Gestión de Categorías"
            : "Relación Producto-Proveedor"}
      </h2>

      {/* Botones de navegación */}
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
        <Button
          label="Relación Productos y Proveedores"
          icon="pi pi-link"
          className="p-button view-products-providers-button"
          onClick={() => handleSwitchSection("products-and-providers")}
        />
      </div>

      {/* Productos*/}
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

      {/* Categorias*/}
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

      {/* Sección Producto-Proveedor */}
      {activeSection === "products-and-providers" && (
        <section className="products-and-providers-section">
          {/* Componente de Búsqueda */}
          <ProductProviderSearch
            providers={providers} // Lista de proveedores para el dropdown
            onProviderSelected={handleProviderSelection} // Selección de un proveedor
            onClearSearch={() => setProductProviders([])} // Limpiar resultados
            onSearchResults={(results) => setProductProviders(results)} // Actualizar lista de relaciones
          />

          {/* Botón para agregar una nueva relación */}
          <div className="button-container">
            <Button
              label="Agregar Relación"
              icon="pi pi-plus"
              className="p-button-info add-relacion-button"
              onClick={handleAddRelation}
            />
          </div>

          {/* Mostrar formulario si está visible */}
          {isFormVisible && (
            <ProductProviderForm
              productId={null}
              providerId={selectedProvider?.id}
              onRelationSaved={handleRelationSaved}
              onCancel={() => setIsFormVisible(false)}
            />
          )}

          {/* Tabla de relaciones producto-proveedor */}
          <ProductProviderList
            productProviders={productProviders}
            onDeleteRelation={async (relation) => {
              try {
                await productProviderService.deleteRelation(relation.productId, relation.providerId);
                fetchProductProviders(selectedProvider.id); // Actualizar relaciones
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </section>
      )}
    </div>
  );
};

export default ParentComponentProduct;