import React, { useState, useEffect, useMemo, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import {confirmDialog } from "primereact/confirmdialog";
import OrderService from "../../../domain/services/OrderService";
import "./OrderList.css";

const OrderList = ({ onEditOrder, onViewOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const orderService = useMemo(() => new OrderService(), []);

  // Fetch orders on component load
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const fetchedOrders = await orderService.getAllOrders();
        // Asegurarse de que siempre sea un array
        setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : fetchedOrders.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los pedidos.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [orderService]);
  

  // Handle order deletion
  const handleDelete = (orderId) => {
    confirmDialog({
      message: "¿Está seguro de que desea eliminar este pedido?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await orderService.deleteOrder(orderId);
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Pedido eliminado correctamente.",
            life: 3000,
          });
        } catch (err) {
          console.error("Error deleting order:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo eliminar el pedido.",
            life: 3000,
          });
        }
      },
    });
  };

  return (
    <div className="order-list-container">
      <Toast ref={toast} />
      <h2>Lista de Pedidos</h2>
      <DataTable
        value={orders}
        paginator
        rows={10}
        loading={loading}
        emptyMessage="No se encontraron pedidos."
        responsiveLayout="scroll"
        className="order-list-table"
      >
        <Column field="supplier_name" header="Proveedor" sortable></Column>
        <Column field="orderDate" header="Fecha" sortable></Column>
        <Column field="status" header="Estado" sortable></Column>
        <Column
          header="Acciones"
          body={(rowData) => (
            <div className="order-actions">
              <Button
                label="Ver"
                icon="pi pi-eye"
                className="p-button-info"
                onClick={() => onViewOrder(rowData)}
              />
              <Button
                label="Editar"
                icon="pi pi-pencil"
                className="p-button-warning"
                onClick={() => onEditOrder(rowData)}
              />
              <Button
                label="Eliminar"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => handleDelete(rowData.id)}
              />
            </div>
          )}
        ></Column>
      </DataTable>
    </div>
  );
};

export default OrderList;
