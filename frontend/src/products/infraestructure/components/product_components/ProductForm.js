import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ProductService from "../../../domain/services/ProductService";
import { ProductDTO } from "../../dto/ProductDTO";
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const productService = useMemo(() => new ProductService(), []);
  const [hasNotified, setHasNotified] = useState(false);
  const toast = useRef(null);

  // Obtener el producto en modo edición
  const fetchProduct = useCallback(async () => {
    if (!productId || hasNotified) return; // Evita múltiples notificaciones
    setLoading(true);
    try {
      const response = await productService.getProductById(productId);
      setProductData(response.data);
  
      toast.current.show({
        severity: "info",
        summary: "Product Loaded",
        detail: "Product details loaded successfully.",
      });
      setHasNotified(true); // Marca como notificado
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch product details.",
      });
    } finally {
      setLoading(false);
    }
  }, [productId, productService, hasNotified]);
  

  useEffect(() => {
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
  }, [productId, fetchProduct]);

  // Manejo del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación de campos obligatorios
    if (!productData.name || !productData.category_id) {
      toast.current.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Name and Category ID are required.",
      });
      setLoading(false);
      return;
    }

    const productDTO = new ProductDTO(productData);

    try {
      if (isEditMode) {
        await productService.updateProduct(productId, productDTO.toDomain());
        toast.current.show({
          severity: "success",
          summary: "Product Updated",
          detail: "Product updated successfully.",
        });
      } else {
        await productService.createProduct(productDTO.toDomain());
        toast.current.show({
          severity: "success",
          summary: "Product Created",
          detail: "Product created successfully.",
        });
      }
      onProductSaved();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save product.",
      });
    } finally {
      setLoading(false);
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
                placeholder="Product Name *"
                value={productData.name}
                onChange={(e) =>
                  setProductData({ ...productData, name: e.target.value })
                }
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
                placeholder="Select Unit (optional)"
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-row">
              <InputText
                id="stock"
                placeholder="Enter stock quantity (e.g., 100)"
                value={productData.stock === 0 ? "" : productData.stock} // Mostrar el placeholder si el valor es 0
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    stock: e.target.value === "" ? 0 : parseInt(e.target.value, 10), // Actualizar a 0 si el campo está vacío
                  })
                }
              />
            </div>
            <div className="form-row">
              <InputText
                id="category_id"
                placeholder="Enter category ID (e.g., 1)"
                value={productData.category_id}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    category_id: parseInt(e.target.value, 10) || 0,
                  })
                }
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
            onClick={onCancel}
          />
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
