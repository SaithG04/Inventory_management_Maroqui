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

const ProductForm = ({ productId, onProductSaved, onCancel }) => {
  const [productData, setProductData] = useState({
    nombre: "",
    descripcion: "",
    unidad_medida: "",
    stock: 0,
    nombre_categoria: "",
    estado: "OUT_OF_STOCK",
    precio_venta: ""
  });

  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para bloquear el botón Guardar
  const [isFetching, setIsFetching] = useState(false); // Estado para indicar carga de datos al editar
  const [showCancelModal, setShowCancelModal] = useState(false);

  const productService = useMemo(() => new ProductService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);
  const toast = useRef(null);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAllCategories();
      const categoryOptions = response.map((category) => ({
        label: category.nombre,
        value: category.nombre // Mantener el nombre de la categoría en español
      }));
      setCategories(categoryOptions);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las categorías.",
      });
    }
  }, [categoryService]);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    setIsFetching(true); // Activar estado de carga
    try {
      const response = await productService.getProductById(productId);
      console.log("Producto obtenido para editar:", response); // <-- Verifica el valor aquí
      setProductData({
        nombre: response.nombre || "", // Asegúrate de que aquí llega un valor válido
        descripcion: response.descripcion || "",
        unidad_medida: response.unidad_medida || "",
        stock: response.stock ?? 0,
        nombre_categoria: response.nombre_categoria || "",
        estado: response.estado || "OUT_OF_STOCK",
        precio_venta: response.precio_venta != null ? response.precio_venta.toString() : ""
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron obtener los detalles del producto.",
        life: 3000,
      });
    } finally {
      setIsFetching(false); // Desactivar estado de carga
    }
  }, [productId, productService]);


  useEffect(() => {
    (async () => {
      await fetchCategories();
      if (productId) {
        setIsEditMode(true);
        await fetchProduct();
      } else {
        setIsEditMode(false);
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
    })();
  }, [productId, fetchProduct, fetchCategories]);

  const validateUniqueName = async () => {
    const productsWithSameName = await productService.isProductNameUnique(productData.nombre);

    if (isEditMode) {
      // Si estás editando, asegúrate de que el nombre no pertenezca a otro producto
      const isNameUsedByAnotherProduct = productsWithSameName.some(
        (product) => product.id_producto !== productId
      );

      if (isNameUsedByAnotherProduct) {
        throw new Error("Ya existe otro producto con este nombre.");
      }
    } else {
      // Si estás creando, asegúrate de que no exista ningún producto con el mismo nombre
      if (productsWithSameName.length > 0) {
        throw new Error("Ya existe un producto con este nombre.");
      }
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activar estado de carga
    try {
      // Validar que el nombre del producto sea único
      await validateUniqueName();

      // Asegurar que la descripción tenga un valor predeterminado
      const updatedProductData = {
        ...productData,
        descripcion: productData.descripcion.trim() || "Sin descripción", // Si está vacío, asigna "Sin descripción"
      };

      const productDTO = new ProductDTO(updatedProductData);
      const product = new Product(productDTO.toDomain());
      product.validate(); // Validar datos

      if (isEditMode) {
        await productService.updateProduct(productId, productDTO.toDomain());
        toast.current?.show({
          severity: "success",
          summary: "Producto Actualizado",
          detail: "El producto fue actualizado correctamente.",
        });
      } else {
        await productService.createProduct(productDTO.toDomain());
        toast.current?.show({
          severity: "success",
          summary: "Producto Creado",
          detail: "El producto fue creado correctamente.",
        });
      }

      onProductSaved(); // Notificar al padre que se guardó
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error de Validación",
        detail: err.message,
      });
    } finally {
      setIsLoading(false); // Desactivar estado de carga
    }
  };




  const handleCancel = () => {
    if (
      productData.nombre ||
      productData.nombre_categoria ||
      productData.unidad_medida ||
      productData.descripcion ||
      productData.stock !== 0 ||
      productData.precio_venta
    ) {
      setShowCancelModal(true);
    } else {
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
