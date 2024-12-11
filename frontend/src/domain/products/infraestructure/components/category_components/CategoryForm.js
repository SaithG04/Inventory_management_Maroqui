import React, { useState, useEffect, useMemo, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import CategoryService from "../../../domain/services/CategoryService";
import { CategoryDTO } from "../../dto/CategoryDTO";
import Modal from "../../../../../infrastructure/shared/modal/Modal";
import "./CategoryForm.css";

const CategoryForm = ({ categoryId, initialData, onCategorySaved, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false); // Estado para manejar la duplicidad
  const categoryService = useMemo(() => new CategoryService(), []);
  const toast = useRef(null);

  // Cargar datos iniciales al abrir el formulario
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        status: initialData.status || "ACTIVE",
      });
      setIsEditMode(!!categoryId); // Configura el modo de edición según el ID
    }
  }, [initialData, categoryId]);

  // Verificar duplicidad de nombre de categoría
  const checkDuplicateCategory = async (categoryName) => {
    try {
      const existingCategories = await categoryService.getAllCategories();
      const isCategoryDuplicate = existingCategories.some(
        (category) => category.nombre.toLowerCase() === categoryName.toLowerCase()
      );
      setIsDuplicate(isCategoryDuplicate); // Actualizar el estado si ya existe una categoría con el mismo nombre
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al verificar duplicados.",
      });
    }
  };

  // Manejo de cambios en el input
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id === "name") {
      checkDuplicateCategory(value); // Verificar duplicidad cuando se cambia el nombre
    }
  };

  const handleDropdownChange = (e) => {
    setFormData((prev) => ({ ...prev, status: e.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "El nombre de la categoría es obligatorio.",
      });
      setLoading(false);
      return;
    }

    // Si el nombre ya existe, mostrar el mensaje de advertencia
    if (isDuplicate) {
      toast.current.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Ya existe una categoría con ese nombre.",
      });
      setLoading(false);
      return;
    }

    const categoryDTO = new CategoryDTO({
      nombre: formData.name.trim(),
      descripcion: formData.description.trim(),
      estado: formData.status,
    });

    try {
      if (isEditMode) {
        const response = await categoryService.updateCategory(categoryId, categoryDTO.toDomain());
        toast.current.show({
          severity: "success",
          summary: "Categoría Actualizada",
          detail: `La categoría "${response.nombre}" fue actualizada correctamente.`,
        });
      } else {
        const response = await categoryService.createCategory(categoryDTO.toDomain());
        toast.current.show({
          severity: "success",
          summary: "Categoría Creada",
          detail: `La categoría "${response.nombre}" fue creada correctamente.`,
        });
      }
      onCategorySaved();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Error al guardar la categoría.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.name.trim() || formData.description.trim()) {
      setShowCancelModal(true);
    } else {
      onCancel();
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
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="category-form-row">
          <textarea
            id="description"
            className="category-form-textarea"
            placeholder="Enter Description (Optional)"
            value={formData.description}
            rows="5"
            onChange={handleInputChange}
          />
        </div>

        <div className="category-form-row">
          <Dropdown
            id="status"
            value={formData.status}
            className="category-form-dropdown"
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
            onChange={handleDropdownChange}
            placeholder="Select Status"
          />
        </div>

        <div className="category-form-buttons">
          <Button
            label={loading ? "Saving..." : "Save"}
            icon="pi pi-save"
            type="submit"
            className="p-button-success"
            disabled={loading} // No bloqueamos el botón, solo mostramos el mensaje de advertencia
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

      <Modal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          onCancel();
        }}
        title="Confirmación"
        message="Hay datos ingresados en el formulario. ¿Estás seguro de que deseas cancelar?"
      />
    </div>
  );
};

export default CategoryForm;
