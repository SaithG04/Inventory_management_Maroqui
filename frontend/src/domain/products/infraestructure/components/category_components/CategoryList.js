import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Modal from "../../../../../infrastructure/shared/modal/Modal";
import "./CategoryList.css";

const CategoryList = ({ categories, onEditCategory, onDeleteCategory }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const toast = useRef(null);

  const confirmDeleteCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowModal(true);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) {
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "No hay una categoría seleccionada para eliminar.",
      });
      return;
    }

    try {
      await onDeleteCategory(selectedCategoryId);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Categoría eliminada correctamente.",
      });
      setShowModal(false);
      setSelectedCategoryId(null);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar la categoría.",
      });
    }
  };

  const actionBodyTemplate = (rowData) => (
    <div className="actions">
      <Button
        icon="pi pi-pencil"
        label="Editar"
        className="p-button-rounded p-button-success"
        onClick={() => onEditCategory(rowData)}
        tooltip="Editar esta categoría"
      />
      <Button
        icon="pi pi-trash"
        label="Eliminar"
        className="p-button-rounded p-button-danger"
        onClick={() => confirmDeleteCategory(rowData.id_categoria)}
        tooltip="Eliminar esta categoría"
      />
    </div>
  );

  const descriptionBodyTemplate = (rowData) => (
    <div className="description-wrapper" title={rowData.descripcion}>
      {rowData.descripcion || "Sin descripción"}
    </div>
  );

  return (
    <div className="category-list">
      <Toast ref={toast} />
      <DataTable value={categories} paginator rows={10} responsiveLayout="scroll" className="p-datatable-striped">
        <Column field="nombre" header="Nombre" sortable headerStyle={{ textAlign: "center" }} />
        <Column field="descripcion" header="Descripción" body={descriptionBodyTemplate} headerStyle={{ textAlign: "center" }} />
        <Column field="estado" header="Estado" sortable headerStyle={{ textAlign: "center" }} />
        <Column body={actionBodyTemplate} headerStyle={{ textAlign: "center" }} />
      </DataTable>

      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCategoryId(null);
        }}
        onConfirm={handleDeleteCategory}
        title="Confirmación de Eliminación"
        message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
        cancelButtonProps={{
          label: "Cancelar",
          className: "p-button-secondary",
        }}
        confirmButtonProps={{
          label: "Eliminar",
          className: "p-button-danger",
        }}
      />
    </div>
  );
};

export default CategoryList;
