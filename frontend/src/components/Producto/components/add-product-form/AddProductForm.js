// AddProductForm.js
import React, { useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import ProductService from '../../../../services/products/ProductService';
import './AddProductForm.css';

const AddProductForm = ({
    newProduct = { stock: 0 },
    categoryOptions = [],
    handleInputChange,
    handleCategoryChange,
    handleStatusChange,
    handleAddOrEditProduct,
    isEditing,
    originalProduct = {}, // Producto original para comparación al editar
}) => {
    const toast = useRef(null);

    // Validar y manejar el cambio de descripción
    const handleDescriptionChange = (e) => {
        handleInputChange(e);
        if (e.target.value.trim() === '') {
            e.target.value = 'Sin Descripción';
        }
    };

    // Validar y manejar el cambio de stock
    const handleStockChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 0) {
            handleInputChange(e);
            if (value === 0) {
                handleStatusChange({ value: 'OUT_OF_STOCK' });
            }
        } else {
            handleInputChange({
                target: {
                    name: 'stock',
                    value: 0,
                },
            });
            toast.current.show({
                severity: 'warn',
                summary: 'Valor Inválido',
                detail: 'El stock no puede ser negativo. Se ha ajustado a 0.',
                life: 3000,
            });
        }
    };

    // Validación de formulario antes de enviar
    const validateForm = async () => {
        if (!newProduct.nombre || newProduct.nombre.trim() === '') {
            toast.current.show({
                severity: 'warn',
                summary: 'Campo Requerido',
                detail: 'El nombre es obligatorio.',
                life: 3000,
            });
            return false;
        }
        if (!newProduct.unidad_medida || newProduct.unidad_medida.trim() === '') {
            toast.current.show({
                severity: 'warn',
                summary: 'Campo Requerido',
                detail: 'La unidad de medida es obligatoria.',
                life: 3000,
            });
            return false;
        }
        if (!newProduct.id_categoria) {
            toast.current.show({
                severity: 'warn',
                summary: 'Campo Requerido',
                detail: 'La categoría es obligatoria.',
                life: 3000,
            });
            return false;
        }
        if (!newProduct.estado) {
            toast.current.show({
                severity: 'warn',
                summary: 'Campo Requerido',
                detail: 'El estado es obligatorio.',
                life: 3000,
            });
            return false;
        }
    
        // Verificar duplicados solo si se está creando un nuevo producto
        if (!isEditing) {
            const nombreDuplicado = await checkIfProductExists(newProduct.nombre);
            if (nombreDuplicado) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Nombre Duplicado',
                    detail: 'Ya existe un producto con este nombre.',
                    life: 3000,
                });
                return false;
            }
        }
    
        return true;
    };
    

    // Verificar si ya existe un producto con el mismo nombre
    const checkIfProductExists = async (productName) => {
        try {
            const response = await ProductService.findByName(productName);
            if (response && response.content && Array.isArray(response.content)) {
                return response.content.some(
                    (product) => product.nombre.toLowerCase() === productName.toLowerCase()
                );
            } else if (Array.isArray(response)) {
                return response.some(
                    (product) => product.nombre.toLowerCase() === productName.toLowerCase()
                );
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al verificar si el producto existe:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo verificar la existencia del producto.',
                life: 3000,
            });
            return false;
        }
    };

    const handleSubmit = async () => {
        if (await validateForm()) {
            if (!newProduct.descripcion || newProduct.descripcion.trim() === '') {
                handleInputChange({
                    target: {
                        name: 'descripcion',
                        value: 'Sin Descripción',
                    },
                });
            }
            handleAddOrEditProduct();
        }
    };

    return (
        <div className="add-product-form">
            <Toast ref={toast} />

            <h3>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h3>

            {/* Primer fila de inputs */}
            <div className="form-row">
                <input
                    type="text"
                    name="nombre"
                    value={newProduct.nombre || ''}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    className="input-name"
                />
                <input
                    type="text"
                    name="unidad_medida"
                    value={newProduct.unidad_medida || ''}
                    onChange={handleInputChange}
                    placeholder="Unidad de medida"
                    className="input-unit-measurement"
                />
            </div>

            {/* Segunda fila de inputs */}
            <div className="form-row">
                <input
                    type="text"
                    name="descripcion"
                    value={newProduct.descripcion || ''}
                    onBlur={handleDescriptionChange}
                    onChange={handleInputChange}
                    placeholder="Descripción"
                    className="input-description"
                />
                <input
                    type="number"
                    name="stock"
                    value={newProduct.stock !== undefined ? newProduct.stock : 0}
                    onChange={handleStockChange}
                    placeholder="Stock"
                    className="input-stock"
                    min="0"
                />
            </div>

            {/* Dropdowns */}
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
                        { name: 'Sin stock', value: 'OUT_OF_STOCK' },
                    ]}
                    onChange={handleStatusChange}
                    optionLabel="name"
                    placeholder="Selecciona un estado"
                    className="status-dropdown"
                />
            </div>

            {/* Botón */}
            <div className="add-product-section">
                <Button
                    label={isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
                    icon="pi pi-check"
                    onClick={handleSubmit}
                    className={`${isEditing ? 'p-button-update' : 'p-button-agproduct'} add-button add`}
                />
            </div>
        </div>
    );
};

export default AddProductForm;
