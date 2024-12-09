import React, { useState, useEffect, useMemo, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
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
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load orders.",
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
      message: "Are you sure you want to delete this order?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await orderService.deleteOrder(orderId);
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Order deleted successfully.",
            life: 3000,
          });
        } catch (err) {
          console.error("Error deleting order:", err);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete order.",
            life: 3000,
          });
        }
      },
    });
  };

  return (
    <div className="order-list-container">
      <Toast ref={toast} />
      <h2>Order List</h2>
      <DataTable
        value={orders}
        paginator
        rows={10}
        loading={loading}
        emptyMessage="No orders found."
        responsiveLayout="scroll"
        className="order-list-table"
      >
        <Column field="supplier" header="Supplier" sortable></Column>
        <Column field="date" header="Date" sortable></Column>
        <Column field="status" header="Status" sortable></Column>
        <Column
          header="Actions"
          body={(rowData) => (
            <div className="order-actions">
              <Button
                label="View"
                icon="pi pi-eye"
                className="p-button-info"
                onClick={() => onViewOrder(rowData)}
              />
              <Button
                label="Edit"
                icon="pi pi-pencil"
                className="p-button-warning"
                onClick={() => onEditOrder(rowData)}
              />
              <Button
                label="Delete"
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
