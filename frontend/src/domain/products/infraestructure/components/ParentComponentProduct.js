import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ProductForm from "./product_components/ProductForm"; // Componente para el formulario de productos
import ProductList from "./product_components/ProductList"; // Componente para mostrar la lista de productos
import ProductSearch from "./product_components/ProductSearch"; // Componente para la búsqueda de productos
import CategoryForm from "./category_components/CategoryForm"; // Componente para el formulario de categorías
import CategoryList from "./category_components/CategoryList"; // Componente para mostrar la lista de categorías

// Componentes relacionados con la relación producto-proveedor
import ProductProviderList from "./product_provider_components/ProductProviderList"; // Lista de relaciones producto-proveedor
import ProductProviderForm from "./product_provider_components/ProductProviderForm"; // Formulario para relaciones producto-proveedor
import ProductProviderSearch from "./product_provider_components/ProductProviderSearch"; // Búsqueda de relaciones producto-proveedor

import ProductProviderService from "../../domain/services/ProductProviderService"; // Servicio para gestionar relaciones producto-proveedor
import ProviderService from "../../../providers/domain/services/ProviderService"; // Servicio para gestionar proveedores
import CategorySearch from "./category_components/CategorySearch"; // Búsqueda de categorías
import ProductService from "../../domain/services/ProductService"; // Servicio para gestionar productos
import CategoryService from "../../domain/services/CategoryService"; // Servicio para gestionar categorías
import { Button } from "primereact/button"; // Componente Button de PrimeReact
import { Toast } from "primereact/toast"; // Componente Toast de PrimeReact para notificaciones
import "./ParentComponentProduct.css"; // Estilos del componente

const ParentComponentProduct = () => {
  // Estado para manejar la sección activa (productos, categorías, relaciones producto-proveedor)
  const [activeSection, setActiveSection] = useState("products");

  // Estados para manejar el producto o categoría seleccionado
  const [selectedProductId, setSelectedProductId] = useState(null); // ID del producto seleccionado
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // ID de la categoría seleccionada
  const [selectedCategoryData, setSelectedCategoryData] = useState(null); // Datos de la categoría seleccionada

  // Estados para manejar las relaciones producto-proveedor
  const [productProviders, setProductProviders] = useState([]); // Lista de relaciones producto-proveedor
  const [providers, setProviders] = useState([]); // Lista de proveedores
  const [selectedProvider, setSelectedProvider] = useState(null); // Proveedor seleccionado
  const [isFormVisible, setIsFormVisible] = useState(false); // Estado para controlar la visibilidad del formulario

  // Estados para manejar productos y categorías
  const [allProducts, setAllProducts] = useState([]); // Lista de todos los productos
  const [allCategories, setAllCategories] = useState([]); // Lista de todas las categorías

  // Referencia para las notificaciones Toast
  const toast = useRef(null);

  // Servicios memoizados para evitar recreación innecesaria
  const productProviderService = useMemo(() => new ProductProviderService(), []);
  const providerService = useMemo(() => new ProviderService(), []);
  const productService = useMemo(() => new ProductService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);

  // === PRODUCTOS ===
  // Función para cargar todos los productos desde el backend
  const fetchAllProducts = useCallback(async () => {
    try {
      const fetchedProducts = await productService.getAllProducts(); // Obtención de productos
      setAllProducts(fetchedProducts); // Actualizar el estado con los productos obtenidos
    } catch (error) {
      console.error("Error al obtener productos:", error);
      toast.current?.show({ // Mostrar mensaje de error si ocurre un fallo
        severity: "error",
        summary: "Error",
        detail: "Hubo un error al obtener los productos.",
        life: 3000,
      });
    }
  }, [productService]);

  // Ejecutar la función fetchAllProducts cuando el componente se monte
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Función para manejar la adición de un nuevo producto
  const handleAddProduct = () => {
    setSelectedProductId(null); // Limpiar la selección de producto
    setIsFormVisible(true); // Mostrar el formulario
    toast.current?.show({ // Mostrar notificación indicando que se está abriendo el formulario
      severity: "info",
      summary: "Agregar Producto",
      detail: "Abriendo formulario para agregar producto.",
      life: 3000,
    });
  };


  const handleEditProduct = useCallback((product) => {
    const productId = product.id_producto; // Obtiene el ID del producto
    const productName = product.nombre; // Obtiene el nombre del producto
    setSelectedProductId(productId); // Establece el ID del producto seleccionado
    setIsFormVisible(true); // Muestra el formulario para editar el producto
    toast.current?.show({
      severity: "info", // Tipo de notificación (información)
      summary: "Editar Producto", // Título de la notificación
      detail: `Editando producto con Nombre: ${productName}.`, // Detalle de la notificación (nombre del producto)
      life: 3000, // Duración de la notificación en milisegundos
    });
  }, []); // useCallback asegura que la función no se recree a menos que sus dependencias cambien

const handleDeleteProduct = useCallback(async (product) => {
    try {
      // Ejecuta la eliminación del producto en el backend
      await productService.deleteProduct(product.id_producto);

      // Refresca la lista de productos después de la eliminación
      await fetchAllProducts();

      // Muestra la notificación de éxito
      toast.current?.show({
        severity: "success", // Tipo de notificación (éxito)
        summary: "Producto Eliminado", // Título de la notificación
        detail: `El producto "${product.nombre}" fue eliminado correctamente.`, // Detalle con el nombre del producto
        life: 3000, // Duración de la notificación en milisegundos
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);

      // Muestra la notificación de error si falla la eliminación
      toast.current?.show({
        severity: "error", // Tipo de notificación (error)
        summary: "Error", // Título de la notificación
        detail: "No se pudo eliminar el producto.", // Detalle del error
        life: 3000, // Duración de la notificación en milisegundos
      });
    }
  }, [fetchAllProducts, productService]); // Dependencias: fetchAllProducts y productService

// Función llamada cuando un producto es guardado correctamente
const handleProductSaved = () => {
    fetchAllProducts(); // Actualiza la lista de productos
    setIsFormVisible(false); // Cierra el formulario de producto
    toast.current?.show({
      severity: "success", // Tipo de notificación (éxito)
      summary: "Producto Guardado", // Título de la notificación
      detail: "El producto fue guardado correctamente.", // Detalle de la notificación
      life: 3000, // Duración de la notificación en milisegundos
    });
  };

// === BÚSQUEDA ===

// Función llamada cuando se obtienen los resultados de búsqueda
const handleSearchResults = (results) => {
    setAllProducts(results); // Actualiza el estado con los productos encontrados
    if (results.length === 0) {
      toast.current?.show({
        severity: "info", // Tipo de notificación (información)
        summary: "Sin resultados", // Título de la notificación
        detail: "No se encontraron productos que coincidan con la búsqueda.", // Detalle si no hay productos
        life: 3000, // Duración de la notificación en milisegundos
      });
    }
  };

// Función para restablecer la tabla de productos mostrando todos
const handleClearTable = () => {
    fetchAllProducts(); // Vuelve a cargar todos los productos
};

// === CATEGORÍAS ===

// Función para cargar todas las categorías
const fetchAllCategories = useCallback(async () => {
    try {
      const categories = await categoryService.getAllCategories(); // Obtiene todas las categorías desde el backend
      setAllCategories(categories || []); // Establece las categorías obtenidas o un array vacío si no hay datos
    } catch (error) {
      toast.current?.show({
        severity: "error", // Tipo de notificación (error)
        summary: "Error", // Título de la notificación
        detail: "Error al obtener las categorías.", // Detalle del error
        life: 3000, // Duración de la notificación en milisegundos
      });
    }
  }, [categoryService]); // Dependencia: categoryService

// Se ejecuta cada vez que se actualiza fetchAllCategories
useEffect(() => {
    fetchAllCategories(); // Llama a la función para obtener las categorías
  }, [fetchAllCategories]); // Dependencia: fetchAllCategories

// Función llamada cuando se obtienen los resultados de búsqueda de categorías
const handleCategorySearchResults = (results) => {
    console.log("Resultados de búsqueda procesados:", results); // Muestra los resultados en la consola para depuración
    setAllCategories(results); // Actualiza el estado con los resultados de la búsqueda
    if (results.length === 0) {
      toast.current?.show({
        severity: "info", // Tipo de notificación (información)
        summary: "Sin resultados", // Título de la notificación
        detail: "No se encontraron categorías que coincidan con la búsqueda.", // Detalle si no hay categorías
        life: 3000, // Duración de la notificación en milisegundos
      });
    }
  };

  const handleClearCategoryTable = useCallback(() => {
    fetchAllCategories(); // Llama al método ya existente que obtiene todas las categorías
  }, [fetchAllCategories]);
  
  const handleCancelForm = useCallback(() => {
    setIsFormVisible(false);
    toast.current?.show({
      severity: "info",
      summary: "Formulario Cerrado",
      detail: "El formulario se cerró sin guardar cambios.",
      life: 3000,
    });
  }, []);
  
  const handleAddCategory = useCallback(() => {
    setSelectedCategoryId(null);
    setSelectedCategoryData(null);
    setIsFormVisible(true);
    toast.current.show({
      severity: "info",
      summary: "Formulario de Categorías",
      detail: "Formulario de agregar categoría abierto.",
    });
  }, []);
  
  const handleEditCategory = useCallback((category) => {
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
  }, []);
  
  const handleCategorySaved = useCallback(() => {
    fetchAllCategories();
    setIsFormVisible(false);
    toast.current.show({
      severity: "success",
      summary: "Categoría Guardada",
      detail: "La categoría fue guardada correctamente.",
    });
  }, [fetchAllCategories]);
  
  // Función para eliminar una categoría
  const handleDeleteCategory = useCallback(async (categoryId) => {
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
  }, [categoryService, fetchAllCategories]);
  
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
  const handleAddRelation = useCallback(() => {
    setIsFormVisible(true);
  }, []);
  
  // Guardar una relación producto-proveedor
  const handleRelationSaved = useCallback(() => {
    if (selectedProvider) {
      fetchProductProviders(selectedProvider.id); // Actualizar relaciones
    }
    setIsFormVisible(false);
    toast.current.show({
      severity: "success",
      summary: "Relación Guardada",
      detail: "La relación Producto-Proveedor fue guardada correctamente.",
    });
  }, [fetchProductProviders, selectedProvider]);
  
  // Cambiar sección activa
  const handleSwitchSection = useCallback((section) => {
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
  }, []);
  

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
          <ProductSearch
            onSearchResults={handleSearchResults}
            onClearTable={handleClearTable}
          />


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
          <CategorySearch
            onSearchResults={handleCategorySearchResults}
            onClearTable={handleClearCategoryTable}
          />

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
              categories={allCategories} // Lista de categorías desde el estado
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