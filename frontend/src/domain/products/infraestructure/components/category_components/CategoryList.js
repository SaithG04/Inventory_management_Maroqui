import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import CategoryService from "../../../domain/services/CategoryService";
import Modal from "../../../../../infrastructure/shared/modal/Modal";
import "./CategoryList.css";

const CategoryList = ({ onEditCategory, refreshTrigger }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // ID de la categoría seleccionada para eliminar
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const toast = useRef(null); // Ref para manejar notificaciones

  // Memoriza la instancia de CategoryService
  const categoryService = useMemo(() => new CategoryService(), []);

  // Función para obtener las categorías
  const fetchCategories = useCallback(async () => {
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories || []); // Actualiza el estado con las categorías
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al cargar las categorías.",
      });
    }
  }, [categoryService]);

  // Manejo de eliminación de una categoría
  const confirmDeleteCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowModal(true); // Mostrar el modal
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
      await categoryService.deleteCategory(selectedCategoryId);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id_categoria !== selectedCategoryId)
      );
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Categoría eliminada correctamente.",
      });
      setShowModal(false); // Cerrar el modal después de eliminar
      setSelectedCategoryId(null); // Limpiar la categoría seleccionada
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar la categoría.",
      });
      console.error("Error deleting category:", error);
    }
  };

  // Renderización de las acciones en cada fila
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          label="Editar"
          className="p-button-rounded p-button-success"
          onClick={() => onEditCategory(rowData)} // Pasa la categoría completa
          tooltip="Editar esta categoría"
        />
        <Button
          icon="pi pi-trash"
          label="Eliminar"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteCategory(rowData.id_categoria)} // rowData.id_categoria debe tener el valor correcto
          tooltip="Eliminar esta categoría"
        />
      </div>
    );
  };

  // Renderización personalizada para la descripción
  const descriptionBodyTemplate = (rowData) => {
    return (
      <div className="description-wrapper" title={rowData.descripcion}>
        {rowData.descripcion || "Sin descripción"}
      </div>
    );
  };

  // Efecto para cargar las categorías al montar y cuando refreshTrigger cambia
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshTrigger]); // Se actualiza cada vez que refreshTrigger cambia

  return (
    <div className="category-list">
      <Toast ref={toast} /> {/* Componente Toast */}
      <DataTable
        value={categories}
        paginator
        rows={10}
        responsiveLayout="scroll"
        className="p-datatable-striped"
      >
        <Column field="nombre" header="Nombre" sortable headerStyle={{ textAlign: "center" }} />
        <Column
          field="descripcion"
          header="Descripción"
          body={descriptionBodyTemplate}
          headerStyle={{ textAlign: "center" }}
        />
        <Column field="estado" header="Estado" sortable headerStyle={{ textAlign: "center" }} />
        <Column body={actionBodyTemplate} headerStyle={{ textAlign: "center" }} />
      </DataTable>

      {/* Modal para confirmación de eliminación */}
      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false); // Cerrar el modal cuando se cancela
          setSelectedCategoryId(null); // Limpiar la categoría seleccionada
        }}
        onConfirm={handleDeleteCategory} // Pasamos la función para eliminar la categoría
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