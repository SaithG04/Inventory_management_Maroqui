import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import './AddProductForm.css';

const AddProductForm = ({
    newProduct,
    categoryOptions = [],
    handleInputChange,
    handleCategoryChange,
    handleStatusChange,
    handleAddOrEditProduct,
    isEditing
}) => {
    return (
        <div className="add-product-form">
            <h3>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h3>

            {/* Primer fila de inputs: Nombre y Unidad de medida */}
            <div className="form-row">
                <input
                    type="text"
                    name="nombre"
                    value={newProduct.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    className="input-name"
                />
                <input
                    type="text"
                    name="unidad_medida"
                    value={newProduct.unidad_medida}
                    onChange={handleInputChange}
                    placeholder="Unidad de medida"
                    className="input-unit-measurement"
                />
            </div>

            {/* Segunda fila de inputs: Descripción y Stock */}
            <div className="form-row">
                <input
                    type="text"
                    name="descripcion"
                    value={newProduct.descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripción"
                    className="input-description"
                />
                <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    placeholder="Stock"
                    className="input-stock"
                />
            </div>

            {/* Tercera fila: Dropdown para categoría y estado del producto */}
            <div className="form-row">
            <Dropdown
    value={newProduct.id_categoria}
    options={categoryOptions}
    onChange={handleCategoryChange}
    optionLabel="label"
    placeholder="Seleccionar Categoría"
    className="category-dropdown"
/>

<Dropdown
    value={newProduct.estado}
    options={[
        { name: 'Activo', value: 'ACTIVE' },
        { name: 'Inactivo', value: 'INACTIVE' },
        { name: 'Sin stock', value: 'OUT_OF_STOCK' }
    ]}
    onChange={handleStatusChange}
    optionLabel="name"
    placeholder="Selecciona un estado"
    className="status-dropdown"
/>

            </div>

            {/* Sección de botón: Agregar o Actualizar producto */}
            <div className="add-product-section">
                <Button
                    label={isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
                    icon="pi pi-check"
                    onClick={handleAddOrEditProduct}
                    className={isEditing ? 'p-button-update' : 'p-button-agproduct'}
                />
            </div>
        </div>
    );
};

export default AddProductForm;
