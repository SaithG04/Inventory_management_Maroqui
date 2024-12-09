import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import CategoryService from "../../../domain/services/CategoryService";
import { CategoryDTO } from "../../dto/CategoryDTO";
import Modal from "../../../../../infrastructure/shared/modal/Modal";
import "./CategoryForm.css";

const CategoryForm = ({ categoryId, onCategorySaved, onCancel }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false); // Controla la visibilidad del modal
  const categoryService = useMemo(() => new CategoryService(), []);
  const toast = useRef(null);

  const fetchCategory = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const response = await categoryService.getCategoryById(categoryId);
      setCategoryData(response.data);

      toast.current.show({
        severity: "info",
        summary: "Category Loaded",
        detail: "Category details loaded successfully.",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch category details.",
      });
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryService]);

  useEffect(() => {
    if (categoryId) {
      setIsEditMode(true);
      fetchCategory();
    } else {
      setIsEditMode(false);
      setCategoryData({
        name: "",
        description: "",
        status: "ACTIVE",
      });
    }
  }, [categoryId, fetchCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!categoryData.name.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Category Name is required.",
      });
      setLoading(false);
      return;
    }

    const categoryDTO = new CategoryDTO(categoryData);

    try {
      if (isEditMode) {
        await categoryService.updateCategory(categoryId, categoryDTO.toDomain());
        toast.current.show({
          severity: "success",
          summary: "Category Updated",
          detail: "Category updated successfully.",
        });
      } else {
        await categoryService.createCategory(categoryDTO.toDomain());
        toast.current.show({
          severity: "success",
          summary: "Category Created",
          detail: "Category created successfully.",
        });
      }
      onCategorySaved();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save category.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Verifica si hay texto en los campos `name` o `description`
    if (categoryData.name.trim() || categoryData.description.trim()) {
      setShowCancelModal(true); // Muestra el modal si hay datos
    } else {
      // Cancela directamente y cierra el formulario
      setCategoryData({
        name: "",
        description: "",
        status: "ACTIVE",
      }); // Reinicia los datos del formulario
      onCancel(); // Llama al método de cancelación sin acciones adicionales
    }
  };


  return (
    <div className="category-form">
      <Toast ref={toast} />
      <h1>{isEditMode ? "Edit Category" : "Add Category"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="category-form-row">
          <InputText
            id="name"
            placeholder="Enter category name"
            value={categoryData.name}
            onChange={(e) => {
              const value = e.target.value;

              if (new RegExp("^[a-zA-Z\\s]*$").test(value)) {
                setCategoryData({ ...categoryData, name: value });
              } else {
                toast.current.show({
                  severity: "warn",
                  summary: "Invalid Input",
                  detail: "Only letters and spaces are allowed in the Name field.",
                  life: 2000,
                });
              }
            }}
          />
        </div>

        <div className="category-form-row">
          <textarea
            id="description"
            className="category-form-textarea"
            placeholder="Enter Description (Optional)"
            value={categoryData.description}
            rows="5"
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 255) {
                setCategoryData({ ...categoryData, description: value });
              } else {
                toast.current.show({
                  severity: "warn",
                  summary: "Text Too Long",
                  detail: "Description cannot exceed 255 characters.",
                  life: 2000,
                });
              }
            }}
          />
        </div>

        <div className="category-form-row">
          <Dropdown
            id="status"
            value={categoryData.status}
            className="category-form-dropdown"
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
            onChange={(e) => setCategoryData({ ...categoryData, status: e.value })}
            placeholder="Select Status"
          />
        </div>

        <div className="category-form-buttons">
          <Button
            label={loading ? "Saving..." : "Save"}
            icon="pi pi-check"
            type="submit"
            className="p-button-success"
            disabled={loading}
          />
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={handleCancel}
            type="button"
          />
        </div>
      </form>

      {/* Modal para confirmar cancelación */}
      <Modal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)} // Cierra el modal sin cancelar
        onConfirm={() => {
          // Confirma la cancelación
          setShowCancelModal(false); // Cierra el modal
          setCategoryData({
            name: "",
            description: "",
            status: "ACTIVE",
          }); // Reinicia los datos del formulario
          onCancel(); // Llama al método de cancelación para cerrar el formulario
        }}
        title="Confirmación"
        message="Hay datos ingresados en el formulario. ¿Estás seguro de que deseas cancelar?"
      />

    </div>
  );
};

export default CategoryForm;
