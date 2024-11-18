import React, { useState, useRef, useContext } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import Modal from '../../../shared/modal/Modal'; // Importa el modal global
import { ProductContext } from '../../../../context/ProductContext';
import './CreateCategoryForm.css';

const CreateCategoryForm = () => {
    const { addCategory, updateCategory, categoryOptions } = useContext(ProductContext);
    const [categoryName, setCategoryName] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Controla si estamos en modo de edición
    const [oldCategoryName, setOldCategoryName] = useState(''); // Guarda el nombre anterior en caso de edición
    const toast = useRef(null);

    // Estados para el modal
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null); // Categoría seleccionada para edición

    // Función para abrir el modal
    const openModal = (category) => {
        setSelectedCategory(category);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedCategory(null);
    };

    // Función para confirmar la edición desde el modal
    const confirmEdit = () => {
        if (selectedCategory) {
            handleEditCategoryClick(selectedCategory); // Configura la categoría seleccionada para edición
        }
        closeModal();
    };

    const handleAddOrEditCategory = () => {
        if (!categoryName.trim()) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'El nombre de la categoría no puede estar vacío.' });
            return;
        }

        if (isEditing) {
            // Editar la categoría existente
            updateCategory({ oldName: oldCategoryName, newName: categoryName });
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada con éxito.' });
        } else {
            // Crear nueva categoría
            if (categoryOptions.some((cat) => cat.name.toLowerCase() === categoryName.toLowerCase())) {
                toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La categoría ya existe.' });
                return;
            }
            addCategory({ name: categoryName, code: categoryName.toLowerCase().replace(/\s+/g, '') });
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada con éxito.' });
        }

        setCategoryName('');
        setIsEditing(false); // Restablece el modo edición
    };

    const handleEditCategoryClick = (category) => {
        setCategoryName(category.name);
        setOldCategoryName(category.name);
        setIsEditing(true);
    };

    return (
        <div className="add-category-form">
            <Toast ref={toast} />

            {/* Modal Global */}
            <Modal
                show={showModal}
                onClose={closeModal}
                onConfirm={confirmEdit}
                title="Editar Categoría"
                message={`¿Estás seguro de que deseas editar la categoría "${selectedCategory?.name}"?`}
            />

            <h3>{isEditing ? 'Editar Categoría' : 'Crear Categoría'}</h3>
            <div className="form-row">
                <InputText
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Nombre de la Categoría"
                    className="input-category-name"
                />
                <Button
                    label={isEditing ? 'Actualizar Categoría' : 'Crear Categoría'}
                    icon="pi pi-check"
                    onClick={handleAddOrEditCategory}
                    className={isEditing ? 'p-button-update' : 'p-button-agproduct'}
                />
            </div>

            {/* Lista de categorías para editar */}
            <div className="category-list">
                <h4>Categorías Existentes:</h4>
                {categoryOptions.map((category) => (
                    <div key={category.name} className="category-item">
                        <span>{category.name}</span>
                        <Button
                            icon="pi pi-pencil"
                            onClick={() => openModal(category)} // Abre el modal para confirmar la edición
                            className="edit-category-button"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreateCategoryForm;
