import React, { useState, useCallback } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Modal from "../../../../../infrastructure/shared/modal/Modal"; // Importar el modal
import "./ProductList.css";

const ProductList = ({ onEditProduct, onDeleteProduct, products }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para controlar el modal
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado para eliminar

  // Mapeo de los estados en inglés a español
  const translateStatus = (status) => {
    const statusMapping = {
      ACTIVE: "Activo",
      OUT_OF_STOCK: "Sin Stock",
      DISCONTINUED: "Descontinuado",
    };
    return statusMapping[status] || "Desconocido";
  };

  // Renderizado personalizado para la columna de estado
  const renderStatus = useCallback(
    (rowData) => <span>{translateStatus(rowData.estado)}</span>,
    []
  );

  const confirmDeleteProduct = (product) => {
    setSelectedProduct(product); // Establece el producto seleccionado
    setShowDeleteModal(true); // Muestra el modal
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      await onDeleteProduct(selectedProduct); // Llama la función de eliminación con el producto seleccionado
    }
    setShowDeleteModal(false); // Cierra el modal
    setSelectedProduct(null); // Limpia el producto seleccionado
  };

  const renderActions = useCallback(
    (rowData) => (
      <div className="products-button-container">
        <Button
          icon="pi pi-pencil"
          label="Editar"
          className="p-button-rounded p-button-success products-button-edit"
          onClick={() => onEditProduct(rowData)} // Pasamos el objeto completo del producto
        />
        <Button
          icon="pi pi-trash"
          label="Eliminar"
          className="p-button-rounded p-button-danger products-button-delete"
          onClick={() => confirmDeleteProduct(rowData)} // Muestra el modal de confirmación
        />
      </div>
    ),
    [onEditProduct]
  );

  return (
    <div className="product-list">
      <DataTable
        value={products}
        paginator
        rows={10}
        responsiveLayout="scroll"
        emptyMessage="No hay productos disponibles."
      >
        <Column field="nombre" header="Nombre" sortable />
        <Column field="codigo" header="Código" sortable />
        <Column field="descripcion" header="Descripción" />
        <Column field="unidad_medida" header="Unidad de Medida" />
        <Column field="precio_venta" header="Precio Venta" />
        <Column field="stock" header="Stock" />
        <Column field="nombre_categoria" header="Categoría" />
        <Column body={renderStatus} header="Estado" />
        <Column body={renderActions} header="Acciones" />
      </DataTable>

      {/* Modal para confirmación de eliminación */}
      {showDeleteModal && (
        <Modal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)} // Cierra el modal sin eliminar
          onConfirm={handleDeleteConfirm} // Confirma la eliminación
          title="Confirmar Eliminación"
          message={`¿Estás seguro de que deseas eliminar el producto "${selectedProduct?.nombre}"?`}
        />
      )}
    </div>
  );
};

export default ProductList;
