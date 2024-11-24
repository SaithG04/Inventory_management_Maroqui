import React, { useState, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Modal from '../../../shared/modal/Modal';
import './ProductTable.css';

const ProductTable = ({ products, categories, rows, first, onPageChange, handleEdit, handleDelete, isVendedor }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const mergedProducts = useMemo(() => {
        if (!categories || categories.length === 0) {
            return products.map((product) => ({
                ...product,
                category: 'Sin Categoría'
            }));
        }
    
        return products.map((product) => {
            const category = categories.find((cat) => cat.id_categoria === product.id_categoria);
            const mergedProduct = {
                ...product,
                category: category ? category.nombre : 'Sin Categoría'
            };
            console.log('Merged Product:', mergedProduct); // Verifica que el producto tenga el campo `category` asignado correctamente
            return mergedProduct;
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
                        ? `¿Estás seguro de que deseas editar el producto "${selectedProduct?.nombre}"?`
                        : `¿Estás seguro de que deseas eliminar el producto "${selectedProduct?.nombre}"?`
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
                <Column field="estado" header="Estado" sortable />
                <Column
                    field="descripcion"
                    header="Descripción"
                    body={(rowData) => rowData.descripcion || 'Sin Descripción'}
                />
                <Column field="stock" header="Stock" body={(rowData) => rowData.stock || 0} />
                <Column
                    body={(rowData) => (
                        <div className="products-button-container">
                            <Button
                                icon="pi pi-pencil"
                                className={`products-button-edit ${isVendedor ? 'disabled' : ''}`}
                                onClick={() => openModal('edit', rowData)}
                                disabled={isVendedor}
                                label="Editar"
                            />
                            <Button
                                icon="pi pi-trash"
                                className={`products-button-delete ${isVendedor ? 'disabled' : ''}`}
                                onClick={() => openModal('delete', rowData)}
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
