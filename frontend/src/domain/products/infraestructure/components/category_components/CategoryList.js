import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import CategoryService from "../../../domain/services/CategoryService";
import "./CategoryList.css";

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
          label="Editar" // Texto para el botón de Editar
          className="p-button-rounded p-button-success"
          onClick={() => onEditCategory(rowData.id)}
          tooltip="Editar esta categoría"
        />
        <Button
          icon="pi pi-trash"
          label="Eliminar" // Texto para el botón de Eliminar
          className="p-button-rounded p-button-danger"
          onClick={() => handleDeleteCategory(rowData.id)}
          tooltip="Eliminar esta categoría"
        />
      </div>
    );
  };

  // Renderización personalizada para la descripción
  const descriptionBodyTemplate = (rowData) => {
    return (
      <div className="description-wrapper" title={rowData.descripcion}>
        {rowData.descripcion}
      </div>
    );
  };

  // Efecto para cargar las categorías al montar y cuando refreshTrigger cambia
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshTrigger]);

  console.log("Categorías cargadas:", categories);

  return (
    <div className="category-list">
      <DataTable
        value={categories}
        paginator
        rows={10}
        responsiveLayout="scroll"
        className="p-datatable-striped"
      >
        <Column field="nombre" header="Name" sortable headerStyle={{ textAlign: 'center' }} />
        <Column field="descripcion" header="Description" body={descriptionBodyTemplate} headerStyle={{ textAlign: 'center' }} />
        <Column field="estado" header="Status" sortable headerStyle={{ textAlign: 'center' }} />
        <Column body={actionBodyTemplate} headerStyle={{ textAlign: 'center' }} />

      </DataTable>
    </div>
  );
};

export default CategoryList;
