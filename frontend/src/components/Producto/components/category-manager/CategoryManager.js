import React, { useState, useEffect, useRef } from 'react';
import CreateCategoryForm from '../add-category-form/CreateCategoryForm';
import CategoryTable from '../category-table/CategoryTable';
import CategoryService from '../../../../services/products/CategoryService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import Modal from '../../../shared/modal/Modal';
import './CategoryManager.css';

const CategoryManager = ({ categories, setFilteredCategories, searchTerm, searchCriteria }) => {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [hasFormChanges, setHasFormChanges] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const toast = useRef(null);
    const [filteredCategories, setFilteredCategoriesState] = useState([]); // Estado para categorías filtradas

    // Función para cargar categorías (cuando no se pasan como props)
    const fetchCategories = async () => {
        try {
            const categoryList = await CategoryService.listCategories();
            setFilteredCategoriesState(categoryList || []); // Actualiza el estado local de categorías filtradas
        } catch (err) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las categorías.' });
        }
    };

    useEffect(() => {
        if (!categories.length) fetchCategories();
    }, [categories]); // Aseguramos que se ejecute solo cuando `categories` cambie

    useEffect(() => {
        const filterCategories = (categories) => {
            if (!searchTerm || !searchCriteria) return categories;

            return categories.filter((category) => {
                if (searchCriteria === 'nombre') {
                    return category.nombre.toLowerCase().includes(searchTerm.toLowerCase());
                }
                if (searchCriteria === 'estado') {
                    return category.estado.toLowerCase().includes(searchTerm.toLowerCase());
                }
                return true;
            });
        };

        setFilteredCategoriesState(filterCategories(categories));
    }, [searchTerm, searchCriteria, categories]); // Solo depende de searchTerm, searchCriteria y categories


    // Actualizamos el estado de las categorías filtradas en el componente padre
    useEffect(() => {
        setFilteredCategories(filteredCategories); // Aquí se actualiza correctamente el estado en el componente padre
    }, [filteredCategories, setFilteredCategories]); // El setFilteredCategories debería ser una función

    const handleSaveCategory = async (categoryData) => {
        try {
            if (isEditing) {
                await CategoryService.updateCategory(categoryData.id_categoria, categoryData);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada con éxito.' });
            } else {
                await CategoryService.saveCategory(categoryData);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada con éxito.' });
            }
            fetchCategories();
            resetFormState();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la categoría.' });
        }
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDeleteCategory = (id) => {
        setCategoryToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            if (categoryToDelete) {
                await CategoryService.deleteCategory(categoryToDelete);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría eliminada con éxito.' });
                fetchCategories();
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la categoría.' });
        } finally {
            setShowDeleteModal(false);
        }
    };

    const resetFormState = () => {
        setSelectedCategory(null);
        setIsEditing(false);
        setShowForm(false);
        setHasFormChanges(false);
    };

    const handleCancelClick = () => {
        if (hasFormChanges) {
            setShowCancelModal(true);
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
                    categories={categories}
                    onFormChange={(hasChanges) => setHasFormChanges(hasChanges)}
                />
            )}

            <CategoryTable
                categories={filteredCategories.length ? filteredCategories : categories}
                handleEdit={handleEditCategory}
                handleDelete={handleDeleteCategory}
            />
        </div>
    );
};

export default CategoryManager;
