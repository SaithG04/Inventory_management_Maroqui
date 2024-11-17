import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
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
    return (
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
            {/* Columna de Nombre */}
            <Column field="name" header="Nombre" sortable />

            {/* Columna de Categoría */}
            <Column
    field="category"
    header="Categoría"
    body={(rowData) => {
        const category = rowData.category;
        return typeof category === 'object' ? category?.name : category || 'Sin Categoría';
    }}
    sortable
/>


            {/* Columna de Unidad */}
            <Column field="unit" header="Unidad" />

            {/* Columna de Estado */}
            <Column field="status" header="Estado" sortable />

            {/* Columna de Descripción */}
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

            {/* Columna de Stock */}
            <Column field="stock" header="Stock" body={(rowData) => rowData.stock || 0} />

            {/* Columna de Acciones */}
            <Column
                body={(rowData) => (
                    <div className="products-button-container">
                        <Button
                            icon="pi pi-pencil"
                            className="products-button-edit"
                            onClick={() => handleEdit(rowData)}
                            disabled={isVendedor}
                            label="Editar"
                        />
                        <Button
                            icon="pi pi-trash"
                            className="products-button-delete"
                            onClick={() => handleDelete(rowData.id)}
                            disabled={isVendedor}
                            label="Eliminar"
                        />
                    </div>
                )}
            />
        </DataTable>
    );
};

export default ProductTable;
