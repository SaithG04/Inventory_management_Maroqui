import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Modal from "../../../../components/shared/modal/Modal";
import ProductService from "../../../domain/services/ProductService";
import CategoryService from "../../../domain/services/CategoryService";
import { ProductDTO } from "../../dto/ProductDTO";
import Product from '../../../domain/models/Product';

import "./ProductForm.css";

const ProductForm = ({ productId, onProductSaved, onCancel }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    unit_measurement: "",
    stock: 0,
    category_id: 0,
    status: "OUT_OF_STOCK",
  });
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const productService = useMemo(() => new ProductService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);
  const toast = useRef(null);

  // Obtener categorías disponibles
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAllCategories();
      const categoryOptions = response.map((category) => ({
        label: category.name,
        value: category.id,
      }));
      setCategories(categoryOptions);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load categories.",
      });
    }
  }, [categoryService]);

  // Obtener el producto en modo edición
  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const response = await productService.getProductById(productId);
      setProductData(response.data);
      toast.current.show({
        severity: "info",
        summary: "Product Loaded",
        detail: "Product details loaded successfully.",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch product details.",
      });
    } finally {
      setLoading(false);
    }
  }, [productId, productService]);

  useEffect(() => {
    fetchCategories();

    if (productId) {
      setIsEditMode(true);
      fetchProduct();
    } else {
      setIsEditMode(false);
      setProductData({
        name: "",
        description: "",
        unit_measurement: "",
        stock: 0,
        category_id: 0,
        status: "OUT_OF_STOCK",
      });
    }
  }, [productId, fetchProduct, fetchCategories]);

  // Manejo del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Crear el DTO con los datos del formulario
      const productDTO = new ProductDTO(productData);

      // Convertir al modelo de dominio y validar
      const product = new Product(productDTO.toDomain());
      product.validate(); // Lanza errores si los datos no son válidos

      // Ajustar el estado predeterminado
      product.setDefaultStatus();

      // Guardar el producto
      if (isEditMode) {
        await productService.updateProduct(productId, productDTO.toDomain());
        toast.current.show({
          severity: 'success',
          summary: 'Product Updated',
          detail: 'Product updated successfully.',
        });
      } else {
        await productService.createProduct(productDTO.toDomain());
        toast.current.show({
          severity: 'success',
          summary: 'Product Created',
          detail: 'Product created successfully.',
        });
      }

      onProductSaved();
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: err.message,
      });
    }
  };

  const handleCancel = () => {
    if (productData.name || productData.category_id || productData.unit_measurement || productData.description || productData.stock !== 0) {
      setShowCancelModal(true);
    } else {
      onCancel();
    }
  };

  return (
    <div className="add-product-form">
      <Toast ref={toast} />
      <h1>{isEditMode ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="form-column">
            <div className="form-row">
              <InputText
                id="name"
                placeholder="Enter product name"
                value={productData.name}
                onChange={(e) => {
                  const value = e.target.value;

                  // Validar letras, números, espacios, guiones y diagonales
                  if (new RegExp('^[a-zA-Z0-9\\s\\-/]*$').test(value)) {
                    setProductData({ ...productData, name: value });
                  }
                }}
              />
            </div>

            <div className="form-row">
              <InputText
                placeholder="Description (optional)"
                value={productData.description}
                onChange={(e) =>
                  setProductData({ ...productData, description: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <Dropdown
                value={productData.unit_measurement}
                options={[
                  { label: "Unit (UN)", value: "UN" },
                  { label: "Box (CJ)", value: "CJ" },
                  { label: "Meter (MT)", value: "MT" },
                ]}
                onChange={(e) =>
                  setProductData({ ...productData, unit_measurement: e.value })
                }
                placeholder="Select Unit *"
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-row">
              <InputText
                id="stock"
                placeholder="Enter stock quantity (e.g., 100)"
                value={productData.stock} // Permitir 0
                onChange={(e) => {
                  const value = e.target.value;

                  // Validar solo números (positivos o 0)
                  if (/^\d*$/.test(value)) {
                    const stockValue = value === "" ? 0 : parseInt(value, 10); // Manejar vacío como 0
                    setProductData({
                      ...productData,
                      stock: stockValue,
                      status: stockValue > 0 ? "ACTIVE" : "OUT_OF_STOCK", // Actualizar el estado automáticamente
                    });
                  }
                }}
              />
            </div>
            <div className="form-row">
              <Dropdown
                value={productData.category_id}
                options={categories}
                onChange={(e) =>
                  setProductData({ ...productData, category_id: e.value })
                }
                placeholder="Select Category *"
              />
            </div>
            <div className="form-row">
              <Dropdown
                value={productData.status}
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Discontinued", value: "DISCONTINUED" },
                  { label: "Out of Stock", value: "OUT_OF_STOCK" },
                ]}
                onChange={(e) =>
                  setProductData({ ...productData, status: e.value })
                }
                placeholder="Select Status"
              />
            </div>
          </div>
        </div>

        <div className="form-buttons">
          <Button
            label={loading ? "Saving..." : "Save"}
            icon="pi pi-check"
            type="submit"
            className="p-button-success"
            disabled={loading}
          />
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={handleCancel} // Ejecuta la lógica de cancelación
            type="button" // Cambiado de submit a button
          />
        </div>
      </form>
      {/* Modal de confirmación */}
      <Modal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={onCancel}
        title="Confirm Cancellation"
        message="You have unsaved changes. Are you sure you want to cancel?"
      />
    </div>
  );
};

export default ProductForm;
