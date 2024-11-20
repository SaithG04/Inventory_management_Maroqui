import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Modal from '../../../shared/modal/Modal'; // Modal global importado
import './ProductTable.css';

// Función para obtener el token desde las cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

const ProductTable = ({
    rows,
    first,
    onPageChange,
    handleEdit,
    handleDelete,
    isVendedor,
}) => {
    const [products, setProducts] = useState([]); // Estado para los productos
    const [categories, setCategories] = useState([]); // Estado para las categorías
    const [loading, setLoading] = useState(false); // Estado para la carga de datos
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Función para obtener los productos
    const fetchProducts = async () => {
        const token = getCookie('jwtToken');
        setLoading(true);
        try {
            const response = await fetch('http://10.8.0.1:8081/api/product/listProducts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Incluir token en el header
                },
            });
            if (!response.ok) throw new Error('Error al obtener los productos.');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener las categorías
    const fetchCategories = async () => {
        const token = getCookie('jwtToken');
        try {
            const response = await fetch('http://10.8.0.1:8081/api/category/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Incluir token en el header
                },
            });
            if (!response.ok) throw new Error('Error al obtener las categorías.');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error.message);
        }
    };

    // Unir productos con categorías
    const mergeData = () => {
        return products.map((product) => {
            const category = categories.find((cat) => cat.id_categoria === product.id_categoria);
            return {
                ...product,
                category: category ? category.nombre : 'Sin Categoría',
            };
        });
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        const loadData = async () => {
            await fetchProducts();
            await fetchCategories();
        };
        loadData();
    }, []);

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
            handleEdit(selectedProduct); // Llamar al método para editar
        } else if (modalAction === 'delete') {
            handleDelete(selectedProduct.id_producto); // Llamar al método para eliminar
        }
        closeModal();
    };

    const mergedProducts = mergeData();

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
                loading={loading}
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
                    body={(rowData) => (
                        <div className="description-wrapper">
                            <span className="description-cell">
                                {rowData.descripcion || 'Sin Descripción'}
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
                                onClick={() => openModal('edit', rowData)}
                                disabled={isVendedor}
                                label="Editar"
                            />
                            <Button
                                icon="pi pi-trash"
                                className="products-button-delete"
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
