import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom"; // Para obtener el ID de la orden desde la URL
import OrderService from "../../../domain/services/OrderService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams(); // Obtener el ID de la orden desde la URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useMemo(() => React.createRef(), []);
  const orderService = useMemo(() => new OrderService(), []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const fetchedOrder = await orderService.getOrderById(id);
        setOrder(fetchedOrder);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron obtener los detalles del pedido.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, orderService]);

  if (loading) {
    return <div className="order-details-loading">Cargando detalles del pedido...</div>;
  }

  if (!order) {
    return <div className="order-details-error">Pedido no encontrado.</div>;
  }

  return (
    <div className="order-details-container">
      <Toast ref={toast} />
      <h1>Detalles del Pedido</h1>

      {/* Información general del pedido */}
      <div className="order-details-info">
        <p><strong>Proveedor:</strong> {order.supplier}</p>
        <p><strong>Fecha:</strong> {order.date}</p>
        <p><strong>Estado:</strong> {order.status}</p>
        <p><strong>Productos:</strong> {order.products.length}</p>
      </div>

      {/* Tabla de productos en el pedido */}
      <DataTable
        value={order.products}
        responsiveLayout="scroll"
        className="order-details-table"
      >
        <Column field="name" header="Nombre del Producto" />
        <Column field="quantity" header="Cantidad" />
      </DataTable>

      <div className="order-details-buttons">
        <Button
          label="Volver a Pedidos"
          icon="pi pi-arrow-left"
          onClick={() => window.history.back()}
          className="p-button-secondary"
        />
      </div>
    </div>
  );
};

export default OrderDetails;
