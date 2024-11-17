import React, { useState, useRef, useContext } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ProductContext } from '../../../../context/ProductContext';
import './CreateCategoryForm.css';

const CreateCategoryForm = () => {
    const { addCategory, updateCategory, categoryOptions } = useContext(ProductContext);
    const [categoryName, setCategoryName] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Controla si estamos en modo de edición
    const [oldCategoryName, setOldCategoryName] = useState(''); // Guarda el nombre anterior en caso de edición
    const toast = useRef(null);

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
                            onClick={() => handleEditCategoryClick(category)}
                            className="edit-category-button"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreateCategoryForm;
