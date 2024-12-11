import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import Modal from '../../../shared/modal/Modal';
import './CreateCategoryForm.css';

const CreateCategoryForm = ({ isEditing, initialData, onSave, categories, onFormChange }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryStatus, setCategoryStatus] = useState('ACTIVE');
    const [showModal, setShowModal] = useState(false);
    const toast = useRef(null);

    // Inicializar los valores del formulario si se está editando una categoría existente
    useEffect(() => {
        if (initialData) {
            setCategoryName(initialData.nombre);
            setCategoryDescription(initialData.descripcion);
            setCategoryStatus(initialData.estado);
        }
    }, [initialData]);

    // Notificar cambios en el formulario al `CategoryManager` (para activar el control de cancelación)
    useEffect(() => {
        onFormChange(categoryName !== '' || categoryDescription !== '');
    }, [categoryName, categoryDescription, onFormChange]);

    const handleAddOrEditCategory = async () => {
        if (!categoryName.trim()) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'El nombre de la categoría no puede estar vacío.' });
            return;
        }

        // Verificar si ya existe una categoría con el mismo nombre
        const existingCategory = categories.find(
            (category) => category.nombre.toLowerCase() === categoryName.trim().toLowerCase()
        );

        if (existingCategory && !isEditing) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ya existe una categoría con este nombre.' });
            return;
        }

        try {
            if (isEditing) {
                setShowModal(true); // Mostrar el modal antes de confirmar la edición
            } else {
                onSave({
                    nombre: categoryName,
                    descripcion: categoryDescription,
                    estado: categoryStatus,
                });
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada con éxito.' });
                resetForm();
            }
        } catch (error) {
            console.error('Error al agregar o editar categoría:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo completar la operación.' });
        }
    };

    const confirmEdit = () => {
        onSave({
            id_categoria: initialData?.id_categoria, // Asegúrate de que `id_categoria` tenga un valor válido
            nombre: categoryName,
            descripcion: categoryDescription,
            estado: categoryStatus,
        });
        resetForm();
        setShowModal(false);
    };
    
    

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
                message={`¿Estás seguro de que deseas editar la categoría "${categoryName}"?`}
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
                        { label: 'Inactivo', value: 'INACTIVE' }
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
