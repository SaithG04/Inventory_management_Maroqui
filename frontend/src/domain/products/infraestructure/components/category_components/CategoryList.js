import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import CategoryService from "../../../domain/services/CategoryService";
import "./CategoryList.css"; // Estilos personalizados aplicados

const CategoryList = ({ onEditCategory, refreshTrigger }) => {
  const [categories, setCategories] = useState([]);

  // Memoriza la instancia de CategoryService
  const categoryService = useMemo(() => new CategoryService(), []);

  // Función para obtener las categorías
  const fetchCategories = useCallback(async () => {
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [categoryService]);

  // Manejo de eliminación de una categoría
  const handleDeleteCategory = async (categoryId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this category?"
      );
      if (confirmDelete) {
        await categoryService.deleteCategory(categoryId);
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        );
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Renderización de las acciones en cada fila
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success"
          onClick={() => onEditCategory(rowData.id)}
          tooltip="Edit"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDeleteCategory(rowData.id)}
          tooltip="Delete"
        />
      </div>
    );
  };

  // Renderización personalizada para la descripción
  const descriptionBodyTemplate = (rowData) => {
    return (
      <div className="description-wrapper" title={rowData.description}>
        {rowData.description}
      </div>
    );
  };

  // Efecto para cargar las categorías al montar y cuando refreshTrigger cambia
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshTrigger]);

  return (
    <div className="category-list">
      <DataTable
        value={categories}
        paginator
        rows={10}
        responsiveLayout="scroll"
        className="p-datatable-striped"
      >
        <Column field="name" header="Name" sortable />
        <Column
          field="description"
          header="Description"
          body={descriptionBodyTemplate}
        />
        <Column field="status" header="Status" sortable />
        <Column body={actionBodyTemplate} header="Actions" />
      </DataTable>
    </div>
  );
};

export default CategoryList;
