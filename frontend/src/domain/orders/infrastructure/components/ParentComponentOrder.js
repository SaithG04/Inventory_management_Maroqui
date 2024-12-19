import React, { useState, useEffect, useCallback, useMemo } from "react";
import OrderForm from "./order_components/OrderForm";
import OrderList from "./order_components/OrderList";
import OrderSearch from "./order_components/OrderSearch";
import OrderService from "../../domain/services/OrderService";
import Modal from "../../../../infrastructure/shared/modal/Modal"; // Importar Modal
import "./ParentComponentOrder.css";

const ParentComponentOrder = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null); // ID de la orden seleccionada para editar
  const [allOrders, setAllOrders] = useState([]); // Lista de órdenes
  const [isFormVisible, setIsFormVisible] = useState(false); // Controla la visibilidad del formulario
  const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal de confirmación para eliminar
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false); // Controla el modal de cancelación del formulario
  const [orderToDelete, setOrderToDelete] = useState(null); // Almacena la orden a eliminar

  const orderService = useMemo(() => new OrderService(), []);

  // Función para obtener todas las órdenes
  const fetchAllOrders = useCallback(async () => {
    try {
      const response = await orderService.getAllOrders();
      setAllOrders(response || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [orderService]);

  // Función para manejar los resultados de búsqueda
  const handleSearchResults = (results) => {
    setAllOrders(results);
  };

  // Función para mostrar el formulario de agregar
  const handleAddOrder = () => {
    setSelectedOrderId(null); // No hay una orden seleccionada
    setIsFormVisible(true); // Muestra el formulario
  };

  // Función para mostrar el formulario de edición
  const handleEditOrder = (orderId) => {
    setSelectedOrderId(orderId); // Almacena el ID de la orden seleccionada
    setIsFormVisible(true); // Muestra el formulario
  };

  // Función para eliminar una orden
  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId); // Almacena temporalmente la orden a eliminar
    setIsModalVisible(true); // Muestra el modal de confirmación
  };

  // Confirmar eliminación de la orden
  const handleConfirmDelete = async () => {
    try {
      await orderService.deleteOrder(orderToDelete); // Llama al servicio para eliminar la orden
      setIsModalVisible(false); // Cierra el modal
      setOrderToDelete(null); // Limpia el estado
      fetchAllOrders(); // Actualiza la lista de órdenes
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setIsModalVisible(false);
    setOrderToDelete(null); // Limpia el estado
  };

  // Manejar cancelación del formulario
  const handleCancelForm = () => {
    setIsFormVisible(false); // Cierra directamente
  };

  useEffect(() => {
    fetchAllOrders(); // Obtiene todas las órdenes al cargar el componente
  }, [fetchAllOrders]);

  return (
    <div className="orders-container">
      <h2>Gestión de Pedidos</h2>

      {/* Componente de búsqueda */}
      <OrderSearch onSearchResults={handleSearchResults} />

      <div className="button-container">
        <button className="p-button add-order-button" onClick={handleAddOrder}>
          <i className="pi pi-plus" /> Agregar Pedido
        </button>
      </div>

      {/* Mostrar el formulario solo si isFormVisible es true */}
      {isFormVisible && (
        <div className="add-order-form">
          <OrderForm
            orderId={selectedOrderId}
            onOrderSaved={() => {
              setIsFormVisible(false); // Oculta el formulario
              fetchAllOrders(); // Actualiza la lista de órdenes
            }}
            onCancel={handleCancelForm} // Manejar cancelación del formulario
          />
        </div>
      )}

      {/* Lista de órdenes */}
      <div className="orders-list">
        <OrderList
          orders={allOrders}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
        />
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal
        show={isModalVisible}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmación de Eliminación"
        message="¿Está seguro de que desea eliminar este pedido?"
      />

      {/* Modal de confirmación de cancelación del formulario */}
      <Modal
        show={isCancelModalVisible}
        onClose={() => setIsCancelModalVisible(false)}
        onConfirm={() => setIsFormVisible(false)}
        title="Confirmación de Cancelación"
        message="¿Está seguro de que desea cancelar? Los cambios no guardados se perderán."
      />
    </div>
  );
};

export default ParentComponentOrder;
