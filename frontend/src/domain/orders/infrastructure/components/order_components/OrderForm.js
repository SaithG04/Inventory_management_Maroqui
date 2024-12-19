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
    date: "",
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
        console.log("Pedido recuperado:", response); // Debug para verificar los datos

        setOrderData({
          supplier: response.supplier_name || "", // Usar supplier_name
          status: response.status || "PENDING",
          date: response.orderDate || "",
          products: response.products || [],
        });
        setIsEditMode(true);
      } catch (error) {
        console.error("Error al obtener el pedido:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo obtener los detalles del pedido.",
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
            label: supplier.name, // Etiqueta para mostrar
            value: supplier.name, // Valor real
          }))
        );

        const productResponse = await productService.getAllProducts();
        setProducts(productResponse);
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron obtener los proveedores o productos.",
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
        summary: "Error de Validación",
        detail: "El nombre del producto y una cantidad válida son obligatorios.",
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
          summary: "Pedido Actualizado",
          detail: "El pedido se ha actualizado con éxito.",
          life: 3000,
        });
      } else {
        await orderService.createOrder(order);
        toast.current.show({
          severity: "success",
          summary: "Pedido Creado",
          detail: "El pedido se ha creado con éxito.",
          life: 3000,
        });
      }

      onOrderSaved();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "No se pudo guardar el pedido.",
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
      <h1>{isEditMode ? "Editar Pedido" : "Crear Pedido"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <Dropdown
            value={orderData.supplier} // Aquí debe coincidir con supplier_name
            options={suppliers}
            onChange={(e) => setOrderData({ ...orderData, supplier: e.value })}
            placeholder="Seleccione Proveedor"
            className="order-dropdown"
          />
        </div>

        <div className="form-row">
          <Dropdown
            value={orderData.status}
            options={[
              { label: "Pendiente", value: "PENDING" },
              { label: "Procesado", value: "PROCESSED" },
              { label: "Cancelado", value: "CANCELED" },
            ]}
            onChange={(e) => setOrderData({ ...orderData, status: e.value })}
            placeholder="Seleccione Estado"
            className="order-dropdown"
          />
        </div>

        <div className="form-row">
          <InputText
            value={orderData.date}
            onChange={(e) => setOrderData({ ...orderData, date: e.target.value })}
            placeholder="Fecha del Pedido (YYYY-MM-DD)"
            className="order-input"
          />
        </div>

        <div className="form-row">
          <AutoComplete
            value={selectedProduct.name}
            suggestions={filteredProducts}
            completeMethod={searchProducts}
            field="name"
            placeholder="Buscar Producto"
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
            placeholder="Cantidad"
            className="order-input"
          />
          <Button
            label="Agregar Producto"
            icon="pi pi-plus"
            onClick={handleAddProduct}
            className="add-product-button"
          />
        </div>

        <div className="product-list">
          <h1>Productos en el Pedido</h1>
          {orderData.products.map((product, index) => (
            <div key={index} className="product-item">
              <span>{product.name}</span>
              <span>Cantidad: {product.quantity}</span>
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
            label={loading ? "Guardando..." : "Guardar"}
            icon="pi pi-check"
            type="submit"
            className="p-button-success"
            disabled={loading}
          />
          <Button
            label="Cancelar"
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
        title="Confirmar Cancelación"
        message="¿Está seguro de que desea cancelar? Los cambios no guardados se perderán."
      />
    </div>
  );
};

export default OrderForm;
