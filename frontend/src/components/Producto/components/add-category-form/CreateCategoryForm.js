import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import Modal from '../../../shared/modal/Modal';
import { categoryModalMessages } from '../../../../utils/modalMessages';
import './CreateCategoryForm.css';

const CreateCategoryForm = ({ isEditing, initialData, onSave, categories, onFormChange }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryStatus, setCategoryStatus] = useState('ACTIVE');
    const [showModal, setShowModal] = useState(false);
    const toast = useRef(null);

    // Inicializar los valores del formulario si se está editando
    useEffect(() => {
        if (isEditing && initialData) {
            setCategoryName(initialData.nombre);
            setCategoryDescription(initialData.descripcion);
            setCategoryStatus(initialData.estado);
        }
    }, [isEditing, initialData]);

    // Notificar cambios en el formulario al `CategoryManager`
    useEffect(() => {
        onFormChange(categoryName !== '' || categoryDescription !== '');
    }, [categoryName, categoryDescription, onFormChange]);

    // Validar el formulario
    const validateForm = () => {
        if (!categoryName.trim()) {
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El nombre de la categoría no puede estar vacío.',
            });
            return false;
        }

        if (!isEditing) {
            const existingCategory = categories.find(
                (category) => category.nombre.toLowerCase() === categoryName.trim().toLowerCase()
            );
            if (existingCategory) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Ya existe una categoría con este nombre.',
                });
                return false;
            }
        }

        return true;
    };

    // Manejar el guardado de la categoría
    const handleAddOrEditCategory = () => {
        if (!validateForm()) return;

        if (isEditing) {
            setShowModal(true);
        } else {
            saveCategory();
        }
    };

    const saveCategory = () => {
        onSave({
            id_categoria: initialData?.id_categoria, // Solo para edición
            nombre: categoryName.trim(),
            descripcion: categoryDescription.trim() || 'Sin Descripción',
            estado: categoryStatus,
        });

        toast.current.show({
            severity: 'success',
            summary: isEditing ? 'Categoría Actualizada' : 'Categoría Creada',
            detail: isEditing
                ? 'La categoría se actualizó correctamente.'
                : 'La categoría se creó correctamente.',
        });

        resetForm();
    };

    // Confirmar la edición
    const confirmEdit = () => {
        saveCategory();
        setShowModal(false);
    };

    // Resetear el formulario
    const resetForm = () => {
        setCategoryName('');
        setCategoryDescription('');
        setCategoryStatus('ACTIVE');
    };

    return (
        <div className="add-category-form">
            <Toast ref={toast} />

            {/* Modal para confirmar la edición */}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmEdit}
                title="Confirmar Edición"
                message={categoryModalMessages.edit(categoryName)}
            />

            <h3>{isEditing ? 'Editar Categoría' : 'Crear Categoría'}</h3>

            {/* Campos de formulario */}
            <div className="form-row">
                <InputText
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Nombre de la Categoría"
                    className="input-category-name"
                />
                <Dropdown
                    value={categoryStatus}
                    options={[
                        { label: 'Activo', value: 'ACTIVE' },
                        { label: 'Inactivo', value: 'INACTIVE' },
                    ]}
                    onChange={(e) => setCategoryStatus(e.value)}
                    placeholder="Estado"
                    className="dropdown-category-status"
                />
            </div>

            <div className="form-row">
                <InputText
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="Descripción de la Categoría"
                    className="input-category-description"
                />
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
                <Button
                    label={isEditing ? 'Actualizar Categoría' : 'Crear Categoría'}
                    icon="pi pi-check"
                    onClick={handleAddOrEditCategory}
                    className={isEditing ? 'p-button-update' : 'p-button-create'}
                />
            </div>
        </div>
    );
};

export default CreateCategoryForm;
