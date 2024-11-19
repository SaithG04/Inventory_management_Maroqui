import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Modal from '../../../shared/modal/Modal'; // Importa el modal global
import './ProductTable.css';

const ProductTable = ({
    products,
    rows,
    first,
    onPageChange,
    handleEdit,
    handleDelete,
    isVendedor,
}) => {
    // Estados para controlar el modal
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null); // 'edit' o 'delete'
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Función para abrir el modal
    const openModal = (action, product) => {
        setModalAction(action);
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
        setModalAction(null);
        setSelectedProduct(null);
    };

    // Función para confirmar la acción del modal
    const confirmAction = () => {
        if (modalAction === 'edit') {
            handleEdit(selectedProduct);
        } else if (modalAction === 'delete') {
            handleDelete(selectedProduct.id);
        }
        closeModal();
    };

    return (
        <>
            {/* Modal Global */}
            <Modal
                show={showModal}
                onClose={closeModal}
                onConfirm={confirmAction}
                title={modalAction === 'edit' ? "Editar Producto" : "Eliminar Producto"}
                message={
                    modalAction === 'edit'
                        ? `¿Estás seguro de que deseas editar el producto "${selectedProduct?.name}"?`
                        : `¿Estás seguro de que deseas eliminar el producto "${selectedProduct?.name}"?`
                }
            />

            {/* Tabla de Productos */}
            <DataTable
                value={products}
                style={{ margin: '0 auto', width: '100%' }}
                className="product-table productos-table"
                paginator
                rows={rows}
                rowsPerPageOptions={[15, 30, 50]}
                first={first}
                onPage={onPageChange}
                removableSort
                paginatorClassName="custom-paginator"
            >
                <Column field="name" header="Nombre" sortable />
                <Column
                    field="category"
                    header="Categoría"
                    body={(rowData) => {
                        const category = rowData.category;
                        return typeof category === 'object' ? category?.name : category || 'Sin Categoría';
                    }}
                    sortable
                />
                <Column field="unit" header="Unidad" />
                <Column field="status" header="Estado" sortable />
                <Column
                    field="description"
                    header="Descripción"
                    body={(rowData) => (
                        <div className="description-wrapper">
                            <span className="description-cell">
                                {rowData.description || 'Sin Descripción'}
                            </span>
                        </div>
                    )}
                />
                <Column field="stock" header="Stock" body={(rowData) => rowData.stock || 0} />
                <Column
                    body={(rowData) => (
                        <div className="products-button-container">
                            <Button
                                icon="pi pi-pencil"
                                className="products-button-edit"
                                onClick={() => openModal('edit', rowData)} // Abre el modal para "Editar"
                                disabled={isVendedor}
                                label="Editar"
                            />
                            <Button
                                icon="pi pi-trash"
                                className="products-button-delete"
                                onClick={() => openModal('delete', rowData)} // Abre el modal para "Eliminar"
                                disabled={isVendedor}
                                label="Eliminar"
                            />
                        </div>
                    )}
                />
            </DataTable>
        </>
    );
};

export default ProductTable;
