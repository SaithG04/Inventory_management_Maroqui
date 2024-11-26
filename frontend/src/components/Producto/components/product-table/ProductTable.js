import React, { useState, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Modal from '../../../shared/modal/Modal';
import { traducirEstado } from '../../../../utils/translate';
import { productModalMessages } from '../../../../utils/modalMessages';
import './ProductTable.css';

const ProductTable = ({ products, categories, rows, first, onPageChange, handleEdit, handleDelete, isVendedor }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const mergedProducts = useMemo(() => {
        return (products || []).map((product) => {
            const category = categories?.find((cat) => cat.id_categoria === product.id_categoria);
            return {
                ...product,
                category: category ? category.nombre : 'Sin Categoría',
            };
        });
    }, [products, categories]);

    const openModal = (action, product) => {
        setModalAction(action);
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalAction(null);
        setSelectedProduct(null);
    };

    const confirmAction = () => {
        if (modalAction === 'edit') {
            handleEdit(selectedProduct);
        } else if (modalAction === 'delete') {
            handleDelete(selectedProduct.id_producto);
        }
        closeModal();
    };

    return (
        <>
            <Modal
                show={showModal}
                onClose={closeModal}
                onConfirm={confirmAction}
                title={modalAction === 'edit' ? 'Editar Producto' : 'Eliminar Producto'}
                message={
                    modalAction === 'edit'
                        ? productModalMessages.edit(selectedProduct?.nombre)
                        : productModalMessages.delete(selectedProduct?.nombre)
                }
            />

            <DataTable
                value={mergedProducts}
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
                <Column field="nombre" header="Nombre" sortable />
                <Column
                    field="category"
                    header="Categoría"
                    body={(rowData) => rowData.category || 'Sin Categoría'}
                    sortable
                />
                <Column field="unidad_medida" header="Unidad" />
                <Column
                    field="estado"
                    header="Estado"
                    body={(rowData) => traducirEstado(rowData.estado)}
                    sortable
                />
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
                <Column field="stock" header="Stock" body={(rowData) => rowData.stock || 0} />
                <Column
                    body={(rowData) => (
                        <div className={`products-button-container ${isVendedor ? 'disabled' : ''}`}>
                            <Button
                                icon="pi pi-pencil"
                                onClick={() => openModal('edit', rowData)}
                                label="Editar"
                                className="products-button-edit"
                            />
                            <Button
                                icon="pi pi-trash"
                                onClick={() => openModal('delete', rowData)}
                                label="Eliminar"
                                className="products-button-delete"
                            />
                        </div>
                    )}
                />
            </DataTable>
        </>
    );
};

export default ProductTable;
