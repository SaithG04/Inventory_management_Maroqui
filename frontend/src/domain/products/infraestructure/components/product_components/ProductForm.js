import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Modal from "../../../../../infrastructure/shared/modal/Modal";
import ProductService from "../../../domain/services/ProductService";
import CategoryService from "../../../domain/services/CategoryService";
import { ProductDTO } from "../../dto/ProductDTO";
import Product from '../../../domain/models/Product';
import "./ProductForm.css";

const ProductForm = ({ productId, onProductSaved, onCancel, toastRef }) => {
  // Estado para manejar los datos del producto en el formulario
  const [productData, setProductData] = useState({
    nombre: "",
    descripcion: "",
    unidad_medida: "",
    stock: 0,
    nombre_categoria: "",
    estado: "OUT_OF_STOCK",
    precio_venta: ""
  });

  // Estado para manejar las categorías disponibles para seleccionar
  const [categories, setCategories] = useState([]);

  // Estado para controlar el modo de edición (para saber si estamos creando o editando un producto)
  const [isEditMode, setIsEditMode] = useState(false);

  // Estado para bloquear el botón de guardar mientras se está guardando o cargando información
  const [isLoading, setIsLoading] = useState(false);

  // Estado para indicar si estamos cargando los datos de un producto (solo cuando estamos editando)
  const [isFetching, setIsFetching] = useState(false);

  // Estado para mostrar o no el modal de cancelación cuando el usuario intenta salir sin guardar
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Inicialización de servicios con useMemo para evitar recrearlos en cada renderizado
  const productService = useMemo(() => new ProductService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);

  // Ref para el Toast (notificaciones) interno, para mostrar mensajes de éxito o error
  const internalToast = useRef(null);
  const toast = toastRef || internalToast; // Usamos el toast pasado como prop o el ref interno

  // Función que obtiene las categorías desde el backend
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAllCategories();
      // Formateamos las categorías para que se ajusten a los requisitos del componente Dropdown
      const categoryOptions = response.map((category) => ({
        label: category.nombre, // Nombre visible de la categoría
        value: category.nombre, // Valor que se selecciona
      }));
      setCategories(categoryOptions); // Actualizamos el estado con las categorías obtenidas
    } catch (err) {
      // Mostramos un mensaje de error si la carga de categorías falla
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las categorías.",
      });
    }
  }, [categoryService, toast]); // Se agrega 'toast' como dependencia para asegurar que siempre se actualice

  // Función que obtiene los detalles de un producto para editarlo
  const fetchProduct = useCallback(async () => {
    if (!productId) return; // Si no hay productId, no se hace nada
    setIsFetching(true); // Activamos el estado de carga
    try {
      const response = await productService.getProductById(productId);
      // Actualizamos el estado con los datos del producto obtenido
      setProductData({
        nombre: response.nombre || "", // Si no hay nombre, usamos un valor vacío
        descripcion: response.descripcion || "",
        unidad_medida: response.unidad_medida || "",
        stock: response.stock ?? 0, // Si no hay stock, usamos 0
        nombre_categoria: response.nombre_categoria || "",
        estado: response.estado || "OUT_OF_STOCK", // Si no hay estado, usamos OUT_OF_STOCK
        precio_venta:
          response.precio_venta != null
            ? response.precio_venta.toString() // Aseguramos que el precio se convierta a string
            : "",
      });
    } catch (error) {
      // Si ocurre un error al obtener el producto, mostramos un mensaje de error
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron obtener los detalles del producto.",
        life: 3000, // Duración del mensaje de error
      });
    } finally {
      setIsFetching(false); // Desactivamos el estado de carga después de intentar obtener el producto
    }
  }, [productId, productService, toast]); // Se agrega 'toast' como dependencia para siempre tener acceso al ref del Toast

  // useEffect o un useCallback adicional puede ser usado aquí si necesitamos disparar fetchCategories o fetchProduct al montar el componente
  useEffect(() => {
    // Llamar fetchCategories cuando el componente se monta
    fetchCategories();
    // Si hay un productId, intentar obtener el producto para editarlo
    if (productId) {
      fetchProduct();
    }
  }, [fetchCategories, fetchProduct, productId]);


  useEffect(() => {
    // useEffect se ejecuta cuando el componente se monta o cuando 'productId' cambia.
    (async () => {
      // Llamamos a la función fetchCategories para cargar las categorías disponibles
      await fetchCategories();
  
      // Si productId está definido, significa que estamos editando un producto existente
      if (productId) {
        setIsEditMode(true); // Activamos el modo de edición
        await fetchProduct(); // Cargamos los detalles del producto para editarlo
      } else {
        // Si no hay productId, estamos en modo de creación de un nuevo producto
        setIsEditMode(false); // Desactivamos el modo de edición
        // Inicializamos los datos del producto a valores vacíos para el formulario
        setProductData({
          nombre: "",
          descripcion: "",
          unidad_medida: "",
          stock: 0,
          nombre_categoria: "",
          estado: "OUT_OF_STOCK",
          precio_venta: ""
        });
      }
    })(); // Llamamos la función asíncrona de inmediato
  }, [productId, fetchProduct, fetchCategories]); // Dependencias: se vuelve a ejecutar si productId, fetchProduct o fetchCategories cambian
  
  // Función de validación que asegura que el nombre del producto sea único
  const validateUniqueName = async () => {
    // Llamamos a la función isProductNameUnique para verificar si ya existe un producto con el mismo nombre
    const productsWithSameName = await productService.isProductNameUnique(productData.nombre);
    console.log("Productos con el mismo nombre:", productsWithSameName); // Log temporal para depuración
    
    // Si estamos en modo de edición (editando un producto existente)
    if (isEditMode) {
      // Verificamos si hay otro producto con el mismo nombre, pero que no sea el producto actual
      const isNameUsedByAnotherProduct = productsWithSameName.some(
        (product) => product.id_producto !== productId // Comparamos el ID del producto actual
      );
      if (isNameUsedByAnotherProduct) {
        console.log("Lanzando error en modo edición"); // Log temporal para depuración
        throw new Error("Ya existe otro producto con este nombre."); // Lanzamos un error si el nombre está en uso
      }
    } else {
      // Si no estamos en modo de edición (creando un producto nuevo)
      if (productsWithSameName.length > 0) {
        console.log("Lanzando error en modo creación"); // Log temporal para depuración
        throw new Error("Ya existe un producto con este nombre."); // Lanzamos un error si el nombre ya está en uso
      }
    }
  };
  

  const handleSubmit = async (e) => {
    // Prevenimos el comportamiento por defecto del formulario (enviar datos)
    e.preventDefault();
    
    // Activamos el estado de carga para deshabilitar el botón y mostrar una indicación de proceso
    setIsLoading(true);
  
    try {
      // Imprime un log indicando que la validación ha comenzado
      console.log("Validación iniciada");
  
      // Validación de campos obligatorios del producto
      if (!productData.nombre.trim()) {
        console.log("Validación fallida: Nombre vacío");
        // Si el nombre del producto está vacío, lanzamos un error
        throw new Error("El nombre del producto es obligatorio.");
      }
  
      if (!productData.unidad_medida) {
        console.log("Validación fallida: Unidad de medida vacía");
        // Si la unidad de medida está vacía, lanzamos un error
        throw new Error("La unidad de medida es obligatoria.");
      }
  
      if (!productData.nombre_categoria) {
        console.log("Validación fallida: Categoría vacía");
        // Si la categoría está vacía, lanzamos un error
        throw new Error("La categoría es obligatoria.");
      }
  
      // Si todas las validaciones han pasado, se indica que la validación fue exitosa
      console.log("Validación pasada");
  
      // Llamamos a la función para validar que el nombre del producto sea único
      await validateUniqueName();
  
      // Aseguramos que la descripción tenga un valor predeterminado (si está vacía, asignamos "Sin descripción")
      const updatedProductData = {
        ...productData,
        descripcion: productData.descripcion.trim() || "Sin descripción",
      };
  
      // Creamos un objeto ProductDTO con los datos actualizados
      const productDTO = new ProductDTO(updatedProductData);
      // Creamos un objeto Product con los datos del DTO convertido al dominio
      const product = new Product(productDTO.toDomain());
      // Validamos los datos del producto (esto podría ser parte de la lógica de negocio)
      product.validate();
  
      // Si estamos en modo de edición (editando un producto existente)
      if (isEditMode) {
        // Llamamos a la función de actualización del producto
        await productService.updateProduct(productId, productDTO.toDomain());
        // Mostramos una notificación de éxito
        toast.current?.show({
          severity: "success",
          summary: "Producto Actualizado",
          detail: "El producto fue actualizado correctamente.",
        });
      } else {
        // Si no estamos en modo de edición (creando un producto nuevo)
        await productService.createProduct(productDTO.toDomain());
        // Mostramos una notificación de éxito
        toast.current?.show({
          severity: "success",
          summary: "Producto Creado",
          detail: "El producto fue creado correctamente.",
        });
      }
    } catch (error) {
      // Si ocurre un error en cualquier parte del proceso, mostramos el error en un toast
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
    } finally {
      // Finalmente, independientemente de si el proceso fue exitoso o no, desactivamos el estado de carga
      setIsLoading(false);
    }
  };
  


  const handleCancel = () => {
    // Verifica si alguno de los campos del producto tiene algún valor distinto de vacío o predeterminado
    if (
      productData.nombre ||               // Nombre del producto
      productData.nombre_categoria ||     // Categoría del producto
      productData.unidad_medida ||        // Unidad de medida
      productData.descripcion ||          // Descripción
      productData.stock !== 0 ||          // Stock (diferente de 0)
      productData.precio_venta           // Precio de venta
    ) {
      // Si alguno de los campos tiene valores modificados, muestra el modal de cancelación
      setShowCancelModal(true);
    } else {
      // Si no se han realizado cambios, ejecuta la función de cancelación directamente
      onCancel();
    }
  };
  

  return (
    <div className="add-product-form">
      <Toast ref={toast} />
      <h1>{isEditMode ? "Editar Producto" : "Agregar Producto"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="form-column">
            <div className="form-row">
              <InputText
                id="nombre"
                placeholder="Nombre del Producto *"
                value={productData.nombre}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z0-9\s\-/]*$/.test(value)) {
                    setProductData({ ...productData, nombre: value });
                  }
                }}
                disabled={isFetching || isLoading} // Bloquear mientras se cargan los datos
              />
            </div>
  
            <div className="form-row">
              <InputText
                placeholder="Descripción (opcional)"
                value={productData.descripcion}
                onChange={(e) =>
                  setProductData({ ...productData, descripcion: e.target.value })
                }
                disabled={isFetching || isLoading} // Bloquear mientras se cargan los datos
              />
            </div>
            <div className="form-row">
              <Dropdown
                value={productData.unidad_medida}
                options={[
                  { label: "Unidad (UN)", value: "UN" },
                  { label: "Caja (CJ)", value: "CJ" },
                  { label: "Metro (MT)", value: "MT" },
                ]}
                onChange={(e) =>
                  setProductData({ ...productData, unidad_medida: e.value })
                }
                placeholder="Seleccione la Unidad de Medida *"
                disabled={isFetching || isLoading} // Bloquear mientras se cargan los datos
              />
            </div>
            <div className="form-row">
              <InputText
                placeholder="Precio de Venta (opcional)"
                value={productData.precio_venta}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setProductData({ ...productData, precio_venta: value });
                  }
                }}
                disabled={isFetching || isLoading} // Bloquear mientras se cargan los datos
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-row">
              <InputText
                id="stock"
                placeholder="Cantidad en Stock (ej.: 100)"
                value={productData.stock}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    const stockValue = value === "" ? 0 : parseInt(value, 10);
                    setProductData({
                      ...productData,
                      stock: stockValue,
                      estado: stockValue > 0 ? "ACTIVE" : "OUT_OF_STOCK",
                    });
                  }
                }}
                disabled={isFetching || isLoading} // Bloquear mientras se cargan los datos
              />
            </div>
            <div className="form-row">
              <Dropdown
                value={productData.nombre_categoria}
                options={categories}
                onChange={(e) =>
                  setProductData({ ...productData, nombre_categoria: e.value })
                }
                placeholder="Seleccione la Categoría *"
                disabled={isFetching || isLoading} // Bloquear mientras se cargan los datos
              />
            </div>
            <div className="form-row">
              <Dropdown
                value={productData.estado}
                options={[
                  { label: "Activo", value: "ACTIVE" },
                  { label: "Descontinuado", value: "DISCONTINUED" },
                  { label: "Sin Stock", value: "OUT_OF_STOCK" },
                ]}
                onChange={(e) =>
                  setProductData({ ...productData, estado: e.value })
                }
                placeholder="Seleccione el Estado"
                disabled={isFetching || isLoading} // Bloquear mientras se cargan los datos
              />
            </div>
          </div>
        </div>
  
        <div className="form-buttons">
          {/* Botón Guardar */}
          <Button
            label={isLoading ? "Guardando..." : isFetching ? "Cargando..." : "Guardar"}
            icon="pi pi-check"
            type="submit"
            className="p-button-success"
            disabled={isLoading || isFetching} // Bloquear mientras se carga o guarda
          />
          {/* Botón Cancelar */}
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={handleCancel}
            type="button"
            disabled={isLoading || isFetching} // Bloquear mientras se carga o guarda
          />
        </div>
      </form>
  
      <Modal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={onCancel}
        title="Confirmar Cancelación"
        message="Tienes cambios sin guardar. ¿Estás seguro de que deseas cancelar?"
      />
    </div>
  );
  
};

export default ProductForm;
