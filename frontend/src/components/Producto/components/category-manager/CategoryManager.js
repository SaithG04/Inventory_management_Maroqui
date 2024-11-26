import React, { useState, useEffect, useRef } from 'react';
import CreateCategoryForm from '../add-category-form/CreateCategoryForm';
import CategoryTable from '../category-table/CategoryTable';
import CategoryService from '../../../../services/products/CategoryService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import Modal from '../../../shared/modal/Modal'; // Importar el componente Modal para la confirmación
import './CategoryManager.css';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hasFormChanges, setHasFormChanges] = useState(false); // Estado para indicar si el formulario tiene cambios
    const [showCancelModal, setShowCancelModal] = useState(false); // Estado para el modal de confirmación de cancelación
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para el modal de confirmación de eliminación
    const [categoryToDelete, setCategoryToDelete] = useState(null); // Almacena la categoría que se desea eliminar
    const toast = useRef(null);
    const toastShown = useRef(false); // Estado para controlar si el toast de éxito ya fue mostrado

    // Función para cargar categorías
    const fetchCategories = async () => {
        try {
            const categoryList = await CategoryService.listCategories();
            setCategories(categoryList || []);
            // Mostrar notificación solo una vez cuando las categorías se cargan correctamente
            if (categoryList && !toastShown.current) {
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categorías cargadas correctamente.' });
                toastShown.current = true; // Control para evitar múltiples notificaciones
            }
        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las categorías.' });
        }
    };

    // Efecto para cargar categorías al montar el componente
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSaveCategory = async (categoryData) => {
        try {
            if (isEditing) {
                console.log('Actualizando categoría con ID:', categoryData.id_categoria); // Añade un log para verificar el ID antes de llamar al servicio
                await CategoryService.updateCategory(categoryData.id_categoria, categoryData);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada con éxito.' });
            } else {
                await CategoryService.saveCategory(categoryData);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada con éxito.' });
            }
            fetchCategories(); // Actualizar la lista de categorías después de guardar
            resetFormState();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la categoría.' });
        }
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category); // category debería tener `id_categoria`
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDeleteCategory = (id) => {
        setCategoryToDelete(id);
        setShowDeleteModal(true); // Mostrar el modal antes de proceder con la eliminación
    };

    const confirmDelete = async () => {
        try {
            if (categoryToDelete) {
                await CategoryService.deleteCategory(categoryToDelete);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría eliminada con éxito.' });
                fetchCategories(); // Actualizar la lista de categorías después de eliminar
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la categoría.' });
        } finally {
            setShowDeleteModal(false); // Cerrar el modal de confirmación
        }
    };

    const resetFormState = () => {
        setSelectedCategory(null);
        setIsEditing(false);
        setShowForm(false);
        setHasFormChanges(false); // Restablecer el estado de cambios en el formulario
    };

    const handleFormChange = (hasChanges) => {
        setHasFormChanges(hasChanges);
    };

    const handleCancelClick = () => {
        if (hasFormChanges) {
            setShowCancelModal(true); // Mostrar el modal si hay cambios en el formulario
        } else {
            resetFormState();
        }
    };

    const confirmCancel = () => {
        setShowCancelModal(false);
        resetFormState();
    };

    return (
        <div className="category-manager">
            <Toast ref={toast} />

            {/* Modal de Confirmación al Cancelar */}
            <Modal
                show={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={confirmCancel}
                title="Confirmar Cancelación"
                message="¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán."
            />

            {/* Modal de Confirmación para Eliminar */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
            />

            <div className="toggle-button">
                <Button
                    label={showForm ? 'Cancelar' : 'Añadir Categoría'}
                    icon={showForm ? 'pi pi-times' : 'pi pi-plus'}
                    onClick={() => {
                        if (showForm) {
                            handleCancelClick();
                        } else {
                            setShowForm(true);
                        }
                    }}
                    className={`toggle-button ${showForm ? 'cancel-category-button' : 'add-category-button'}`}
                />
            </div>

            {showForm && (
                <CreateCategoryForm
                    isEditing={isEditing}
                    initialData={selectedCategory}
                    onSave={handleSaveCategory}
                    categories={categories} // Pasar categorías al componente de formulario
                    onFormChange={handleFormChange} // Pasar el método para detectar cambios
                />
            )}

            <CategoryTable
                categories={categories}
                handleEdit={handleEditCategory}
                handleDelete={(id) => handleDeleteCategory(id)}
            />
        </div>
    );
};

export default CategoryManager;
