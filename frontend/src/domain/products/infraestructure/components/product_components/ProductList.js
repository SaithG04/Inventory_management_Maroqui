import React, { useState, useCallback } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Modal from "../../../../../infrastructure/shared/modal/Modal"; // Importa el componente Modal para confirmar la eliminación
import "./ProductList.css";

const ProductList = ({ onEditProduct, onDeleteProduct, products }) => {
  // Estado para controlar si se muestra el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Estado para almacenar el producto que se va a eliminar
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Función para traducir el estado de los productos de inglés a español
  const translateStatus = (status) => {
    const statusMapping = {
      ACTIVE: "Activo",           // Estado cuando el producto está activo
      OUT_OF_STOCK: "Sin Stock",  // Estado cuando el producto no tiene stock
      DISCONTINUED: "Descontinuado", // Estado cuando el producto ha sido descontinuado
    };
    // Si el estado no está mapeado, retorna "Desconocido"
    return statusMapping[status] || "Desconocido";
  };

  // Función que renderiza el estado del producto en la tabla
  const renderStatus = useCallback(
    (rowData) => <span>{translateStatus(rowData.estado)}</span>, // Convierte el estado con la función `translateStatus`
    [] // Dependencia vacía, solo se crea una vez
  );

  // Función que establece el producto seleccionado y muestra el modal de eliminación
  const confirmDeleteProduct = (product) => {
    setSelectedProduct(product); // Establece el producto que se va a eliminar
    setShowDeleteModal(true);    // Muestra el modal de confirmación
  };

  // Función que maneja la confirmación de la eliminación del producto
  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      await onDeleteProduct(selectedProduct); // Llama la función de eliminación con el producto seleccionado
    }
    setShowDeleteModal(false); // Cierra el modal
    setSelectedProduct(null);  // Limpia el producto seleccionado
  };

  // Función que renderiza los botones de acción (editar y eliminar) en cada fila
  const renderActions = useCallback(
    (rowData) => (
      <div className="products-button-container">
        {/* Botón para editar el producto */}
        <Button
          icon="pi pi-pencil"
          label="Editar"
          className="p-button-rounded p-button-success products-button-edit"
          onClick={() => onEditProduct(rowData)} // Llama a la función `onEditProduct` con el producto completo
        />
        {/* Botón para eliminar el producto */}
        <Button
          icon="pi pi-trash"
          label="Eliminar"
          className="p-button-rounded p-button-danger products-button-delete"
          onClick={() => confirmDeleteProduct(rowData)} // Muestra el modal de confirmación de eliminación
        />
      </div>
    ),
    [onEditProduct] // Dependencia de `onEditProduct`, solo se actualiza si cambia esta función
  );

  return (
    <div className="product-list">
      <DataTable
        value={products}                // Lista de productos a mostrar en la tabla
        paginator                       // Habilita la paginación
        rows={10}                        // Número de filas por página
        responsiveLayout="scroll"       // Permite el desplazamiento horizontal en dispositivos pequeños
        emptyMessage="No hay productos disponibles." // Mensaje cuando no hay productos
      >
        {/* Definición de columnas de la tabla */}
        <Column field="nombre" header="Nombre" sortable />          {/* Nombre del producto */}
        <Column field="codigo" header="Código" sortable />          {/* Código del producto */}
        <Column field="descripcion" header="Descripción" />        {/* Descripción del producto */}
        <Column field="unidad_medida" header="Unidad de Medida" />  {/* Unidad de medida */}
        <Column field="precio_venta" header="Precio Venta" />       {/* Precio de venta */}
        <Column field="stock" header="Stock" />                     {/* Cantidad en stock */}
        <Column field="nombre_categoria" header="Categoría" />      {/* Categoría del producto */}
        <Column body={renderStatus} header="Estado" />              {/* Estado traducido */}
        <Column body={renderActions} header="Acciones" />           {/* Botones de acción (editar, eliminar) */}
      </DataTable>

      {/* Modal para confirmar la eliminación del producto */}
      {showDeleteModal && (
        <Modal
          show={showDeleteModal}                                  // Controla si el modal se muestra
          onClose={() => setShowDeleteModal(false)}                // Cierra el modal sin eliminar
          onConfirm={handleDeleteConfirm}                          // Confirma la eliminación
          title="Confirmar Eliminación"                            // Título del modal
          message={`¿Estás seguro de que deseas eliminar el producto "${selectedProduct?.nombre}"?`} // Mensaje de confirmación
        />
      )}
    </div>
  );
};

export default ProductList;
