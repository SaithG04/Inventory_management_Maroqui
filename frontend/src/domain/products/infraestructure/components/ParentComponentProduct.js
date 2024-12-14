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
      console.error("Error al obtener productos:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Hubo un error al obtener los productos.",
        life: 3000,
      });
    }
  }, [productService]);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleAddProduct = () => {
    setSelectedProductId(null);
    setIsFormVisible(true);
    toast.current?.show({
      severity: "info",
      summary: "Agregar Producto",
      detail: "Abriendo formulario para agregar producto.",
      life: 3000,
    });
  };

  const handleEditProduct = useCallback((product) => {
    const productId = product.id_producto;
    const productName = product.nombre; // Obtiene el nombre del producto
    setSelectedProductId(productId);
    setIsFormVisible(true);
    toast.current?.show({
      severity: "info",
      summary: "Editar Producto",
      detail: `Editando producto con Nombre: ${productName}.`, // Usa el nombre del producto
      life: 3000,
    });
  }, []);
  
  const handleDeleteProduct = useCallback(async (product) => {
    try {
      // Ejecuta la eliminación del producto
      await productService.deleteProduct(product.id_producto);
  
      // Refresca la lista de productos
      await fetchAllProducts();
  
      // Muestra la notificación de éxito
      toast.current?.show({
        severity: "success",
        summary: "Producto Eliminado",
        detail: `El producto "${product.nombre}" fue eliminado correctamente.`,
        life: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
  
      // Muestra la notificación de error
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el producto.",
        life: 3000,
      });
    }
  }, [fetchAllProducts, productService]);
  
  

  const handleProductSaved = () => {
    fetchAllProducts(); // Actualizar lista de productos
    setIsFormVisible(false);
    toast.current?.show({
      severity: "success",
      summary: "Producto Guardado",
      detail: "El producto fue guardado correctamente.",
      life: 3000,
    });
  };

  // === BÚSQUEDA ===
  const handleSearchResults = (results) => {
    setAllProducts(results); // Actualiza el estado con los resultados de la búsqueda
    if (results.length === 0) {
      toast.current?.show({
        severity: "info",
        summary: "Sin resultados",
        detail: "No se encontraron productos que coincidan con la búsqueda.",
        life: 3000,
      });
    }
  };

  // === CATEGORÍAS ===
  const fetchAllCategories = useCallback(async () => {
    try {
      const categories = await categoryService.getAllCategories();
      setAllCategories(categories || []);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener las categorías.",
        life: 3000,
      });
    }
  }, [categoryService]);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const handleCancelForm = () => {
    setIsFormVisible(false);
    toast.current?.show({
      severity: "info",
      summary: "Formulario Cerrado",
      detail: "El formulario se cerró sin guardar cambios.",
      life: 3000,
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
    toast.current?.show({
      severity: "info",
      summary: "Editar Categoría",
      detail: `Editando la categoría "${category.nombre}".`,
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
  const fetchProductProviders = useCallback(async (supplierId) => {
    console.log("Fetching product providers for supplier:", supplierId);
    try {
      const relations = await productProviderService.getProductsBySupplierId(supplierId);
      const enrichedRelations = relations.map((relation) => ({
        ...relation,
        productName: allProducts.find((p) => p.id === relation.productId)?.name || "Producto Desconocido",
        providerName: providers.find((prov) => prov.id === relation.supplierId)?.name || "Proveedor Desconocido",
      }));
      setProductProviders(enrichedRelations);
    } catch (error) {
      console.error("Error al obtener relaciones:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las relaciones.",
      });
    }
  }, [productProviderService, allProducts, providers]);


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
          {/* Barra de búsqueda para productos */}
          <ProductSearch onSearchResults={handleSearchResults} />

          {/* Botón para agregar productos */}
          <div className="button-container">
            <Button
              label="Agregar Producto"
              icon="pi pi-plus"
              className="p-button-success add-product-button"
              onClick={handleAddProduct}
            />
          </div>

          {/* Formulario de producto */}
          {isFormVisible ? (
            <ProductForm
              productId={selectedProductId} // ID del producto seleccionado (o null para agregar)
              onProductSaved={handleProductSaved} // Actualizar lista de productos
              onCancel={handleCancelForm} // Cerrar el formulario sin guardar
            />
          ) : (
            /* Lista de productos */
            <ProductList
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              products={allProducts} // Pasar la lista de productos
            />

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
              categories={allCategories}      // Lista de categorías desde el estado del padre
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
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