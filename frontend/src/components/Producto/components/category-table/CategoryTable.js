import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Modal from '../../../shared/modal/Modal'; // Asegúrate de importar el componente Modal
import { traducirEstado } from '../../../../utils/translate'; // Reutilizamos la misma función para traducción
import { categoryModalMessages } from '../../../../utils/modalMessages'; // Mensajes específicos para categorías
import './CategoryTable.css';

const CategoryTable = ({ categories, handleEdit, handleDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Abrir el modal con la acción correspondiente
    const openModal = (action, category) => {
        setModalAction(action);
        setSelectedCategory(category);
        setShowModal(true);
    };

    // Cerrar el modal
    const closeModal = () => {
        setShowModal(false);
        setModalAction(null);
        setSelectedCategory(null);
    };

    // Confirmar la acción del modal
    const confirmAction = () => {
        if (modalAction === 'edit') {
            handleEdit(selectedCategory); // Llama a la función de edición
        } else if (modalAction === 'delete') {
            handleDelete(selectedCategory.id_categoria); // Llama a la función de eliminación
        }
        closeModal(); // Cierra el modal después de confirmar
    };

    return (
        <div>
            {/* Modal para confirmaciones */}
            <Modal
                show={showModal}
                onClose={closeModal}
                onConfirm={confirmAction}
                title={modalAction === 'edit' ? 'Editar Categoría' : 'Eliminar Categoría'}
                message={
                    modalAction === 'edit'
                        ? categoryModalMessages.edit(selectedCategory?.nombre)
                        : categoryModalMessages.delete(selectedCategory?.nombre)
                }
            />

            {/* Tabla de categorías */}
            <DataTable
                value={categories}
                className="category-table"
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                removableSort
            >
                <Column field="nombre" header="Nombre" sortable />
                <Column
                    field="descripcion"
                    header="Descripción"
                    body={(rowData) => (
                        <div className="description-wrapper">
                            <span className="description-cell">{rowData.descripcion || 'Sin Descripción'}</span>
                            {rowData.descripcion && (
                                <div className="custom-tooltip">{rowData.descripcion}</div>
                            )}
                        </div>
                    )}
                />
                <Column
                    field="estado"
                    header="Estado"
                    body={(rowData) => traducirEstado(rowData.estado)}
                    sortable
                />
                <Column
                    body={(rowData) => (
                        <div className="category-button-container">
                            <Button
                                icon="pi pi-pencil"
                                className="category-button-edit"
                                onClick={() => openModal('edit', rowData)}
                                label="Editar"
                            />
                            <Button
                                icon="pi pi-trash"
                                className="category-button-delete"
                                onClick={() => openModal('delete', rowData)}
                                label="Eliminar"
                            />
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
};

export default CategoryTable;
