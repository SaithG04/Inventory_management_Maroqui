// AddProductForm.js

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
    handleAddOrEditProduct,  // Lo recibes como prop
    isEditing
}) => {
    return (
        <div className="add-product-form">
            <h3>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <div className="form-row">
                <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    className="input-name"
                />
                <input
                    type="text"
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleInputChange}
                    placeholder="Unidad de medida"
                    className="input-unit-measurement"
                />
            </div>
            <div className="form-row">
                <input
                    type="text"
                    name="description"
                    value={newProduct.description}
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
            <div className="form-row">
                <Dropdown
                    value={newProduct.category} // Asegúrate de que newProduct.category sea un string o un objeto con un valor válido
                    options={categoryOptions}  // Las opciones de categorías
                    onChange={handleCategoryChange} // Usa directamente el manejador que ya tienes
                    optionLabel="name"  // Asegúrate de que las opciones tienen una propiedad 'name'
                    placeholder="Seleccionar Categoría"
                    filter
                    className="category-dropdown"
                />

                <Dropdown
                    value={newProduct.status}
                    options={[
                        { name: 'Activo', value: 'Activo' },
                        { name: 'Descontinuado', value: 'Descontinuado' },
                        { name: 'Sin stock', value: 'Sin stock' }
                    ]}
                    onChange={handleStatusChange}
                    optionLabel="name"
                    placeholder="Selecciona un estado"
                    className="status-dropdown"
                />
            </div>

            <div className="add-product-section">
                <Button
                    label={isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
                    icon="pi pi-check"
                    onClick={handleAddOrEditProduct} // Este es el evento que llama a la función que recibimos como prop
                    className={isEditing ? 'p-button-update' : 'p-button-agproduct'}
                />
            </div>
        </div>
    );
};

export default AddProductForm;
