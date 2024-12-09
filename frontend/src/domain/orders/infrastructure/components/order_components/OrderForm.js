import React, { useState, useEffect, useMemo, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete"; // Componente de autocompletar
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Modal from "../../../../../infrastructure/shared/modal/Modal";
import OrderService from "../../../domain/services/OrderService";
import ProviderService from "../../../../providers/domain/services/ProviderService";
import ProductService from "../../../../products/domain/services/ProductService";
import Order from "../../../domain/models/Order";
import "./OrderForm.css";

const OrderForm = ({ orderId, onOrderSaved, onCancel }) => {
  const [orderData, setOrderData] = useState({
    supplier: "",
    status: "PENDING",
    products: [],
  });
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]); // Todos los productos
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados
  const [selectedProduct, setSelectedProduct] = useState({ name: "", quantity: 1 });
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toast = useRef(null);

  const orderService = useMemo(() => new OrderService(), []);
  const providerService = useMemo(() => new ProviderService(), []);
  const productService = useMemo(() => new ProductService(), []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const response = await orderService.getOrderById(orderId);
        setOrderData(response);
        setIsEditMode(true);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch order details.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchSuppliersAndProducts = async () => {
      try {
        const supplierResponse = await providerService.getAllProviders();
        setSuppliers(
          supplierResponse.map((supplier) => ({
            label: supplier.name,
            value: supplier.name,
          }))
        );

        const productResponse = await productService.getAllProducts();
        setProducts(productResponse);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch suppliers or products.",
          life: 3000,
        });
      }
    };

    fetchOrder();
    fetchSuppliersAndProducts();
  }, [orderId, orderService, providerService, productService]);

  const searchProducts = (event) => {
    const query = event.query.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().startsWith(query)
    );
    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    if (!selectedProduct.name || selectedProduct.quantity <= 0) {
      toast.current.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Product name and valid quantity are required.",
        life: 3000,
      });
      return;
    }

    setOrderData((prevData) => ({
      ...prevData,
      products: [...prevData.products, selectedProduct],
    }));
    setSelectedProduct({ name: "", quantity: 1 });
  };

  const handleRemoveProduct = (index) => {
    setOrderData((prevData) => ({
      ...prevData,
      products: prevData.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const order = new Order(orderData);
      order.validate();

      if (isEditMode) {
        await orderService.updateOrder(orderId, order);
        toast.current.show({
          severity: "success",
          summary: "Order Updated",
          detail: "Order has been updated successfully.",
          life: 3000,
        });
      } else {
        await orderService.createOrder(order);
        toast.current.show({
          severity: "success",
          summary: "Order Created",
          detail: "Order has been created successfully.",
          life: 3000,
        });
      }

      onOrderSaved();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to save the order.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (orderData.supplier || orderData.products.length > 0) {
      setIsModalVisible(true);
    } else {
      onCancel();
    }
  };

  const handleConfirmCancel = () => {
    setIsModalVisible(false);
    onCancel();
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="order-form">
      <Toast ref={toast} />
      <h1>{isEditMode ? "Edit Order" : "Create Order"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <Dropdown
            value={orderData.supplier}
            options={suppliers}
            onChange={(e) => setOrderData({ ...orderData, supplier: e.value })}
            placeholder="Select Supplier"
            className="order-dropdown"
          />
        </div>

        <div className="form-row">
          <Dropdown
            value={orderData.status}
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "Processed", value: "PROCESSED" },
              { label: "Canceled", value: "CANCELED" },
            ]}
            onChange={(e) => setOrderData({ ...orderData, status: e.value })}
            placeholder="Select Status"
            className="order-dropdown"
          />
        </div>

        <div className="form-row">
          <AutoComplete
            value={selectedProduct.name}
            suggestions={filteredProducts}
            completeMethod={searchProducts}
            field="name"
            placeholder="Search Product"
            onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.value })}
            className="order-autocomplete"
          />
          <InputText
            value={selectedProduct.quantity}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                quantity: parseInt(e.target.value, 10) || 1,
              })
            }
            placeholder="Quantity"
            className="order-input"
          />
          <Button
            label="Add Product"
            icon="pi pi-plus"
            onClick={handleAddProduct}
            className="add-product-button"
          />
        </div>

        <div className="product-list">
          <h1>Products in Order</h1>
          {orderData.products.map((product, index) => (
            <div key={index} className="product-item">
              <span>{product.name}</span>
              <span>Quantity: {product.quantity}</span>
              <Button
                icon="pi pi-trash"
                onClick={() => handleRemoveProduct(index)}
                className="remove-product-button"
              />
            </div>
          ))}
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
            onClick={handleCancel}
            className="p-button-secondary"
            type="button"
          />
        </div>
      </form>

      <Modal
        show={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        title="Confirm Cancel"
        message="Are you sure you want to cancel? Unsaved changes will be lost."
      />
    </div>
  );
};

export default OrderForm;
