import React, { useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import ProductService from '../../../../services/ProductService'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import './AddProductForm.css';

const AddProductForm = ({
    newProduct = { stock: 0 }, // Establecer un valor predeterminado inicial para `stock`
    categoryOptions = [],
    handleInputChange,
    handleCategoryChange,
    handleStatusChange,
    handleAddOrEditProduct,
    isEditing
}) => {
    const toast = useRef(null);

    // Validar y manejar el cambio de descripción
    const handleDescriptionChange = (e) => {
        handleInputChange(e); // Actualiza el valor como normalmente lo hace
        if (e.target.value.trim() === '') {
            e.target.value = 'Sin Descripción'; // Si la descripción está vacía, establece el valor predeterminado
        }
    };

    // Validar y manejar el cambio de stock
    const handleStockChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 0) {
            handleInputChange(e); // Solo permite actualizar si el valor es cero o positivo
            if (value === 0) {
                // Cambiar el estado a 'OUT_OF_STOCK' si el stock es 0
                handleStatusChange({ value: 'OUT_OF_STOCK' });
            }
        } else {
            // Restablecer el valor a 0 si se intenta colocar un valor negativo
            handleInputChange({
                target: {
                    name: 'stock',
                    value: 0
                }
            });
            toast.current.show({ severity: 'warn', summary: 'Valor Inválido', detail: 'El stock no puede ser negativo. Se ha ajustado a 0.', life: 3000 });
        }
    };

    // Validación de campos antes de agregar o actualizar el producto
    const validateForm = async () => {
        if (!newProduct.nombre || newProduct.nombre.trim() === '') {
            toast.current.show({ severity: 'warn', summary: 'Campo Requerido', detail: 'El nombre es obligatorio.', life: 3000 });
            return false;
        }
        if (!newProduct.unidad_medida || newProduct.unidad_medida.trim() === '') {
            toast.current.show({ severity: 'warn', summary: 'Campo Requerido', detail: 'La unidad de medida es obligatoria.', life: 3000 });
            return false;
        }
        if (!newProduct.id_categoria) {
            toast.current.show({ severity: 'warn', summary: 'Campo Requerido', detail: 'La categoría es obligatoria.', life: 3000 });
            return false;
        }
        if (!newProduct.estado) {
            toast.current.show({ severity: 'warn', summary: 'Campo Requerido', detail: 'El estado es obligatorio.', life: 3000 });
            return false;
        }

        // Validar si ya existe un producto con el mismo nombre
        if (!isEditing) {
            const nombreDuplicado = await checkIfProductExists(newProduct.nombre);
            if (nombreDuplicado) {
                toast.current.show({ severity: 'warn', summary: 'Nombre Duplicado', detail: 'Ya existe un producto con este nombre.', life: 3000 });
                return false;
            }
        }

        return true;
    };

    // Función para verificar si ya existe un producto con el mismo nombre
    // Función para verificar si ya existe un producto con el mismo nombre
// Función para verificar si ya existe un producto con el mismo nombre
const checkIfProductExists = async (productName) => {
    try {
        // Utilizamos ProductService para buscar si existe un producto con el mismo nombre
        const response = await ProductService.findByName(productName);

        // Verificamos si la respuesta tiene el formato esperado
        if (response && response.content && Array.isArray(response.content)) {
            return response.content.some(
                (product) => product.nombre.toLowerCase() === productName.toLowerCase()
            );
        } else if (Array.isArray(response)) {
            // Si la respuesta es un array directamente (puede que no tenga "content")
            return response.some(
                (product) => product.nombre.toLowerCase() === productName.toLowerCase()
            );
        } else {
            // En caso de que no se encuentre un producto
            return false;
        }
    } catch (error) {
        console.error('Error al verificar si el producto existe:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo verificar la existencia del producto.', life: 3000 });
        return false;
    }
};


    const handleSubmit = async () => {
        if (await validateForm()) {
            // Verificar si la descripción está vacía y establecer un valor predeterminado
            if (!newProduct.descripcion || newProduct.descripcion.trim() === '') {
                handleInputChange({
                    target: {
                        name: 'descripcion',
                        value: 'Sin Descripción'
                    }
                });
            }
            handleAddOrEditProduct();
        }
    };

    return (
        <div className="add-product-form">
            <Toast ref={toast} />

            <h3>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h3>

            {/* Primer fila de inputs: Nombre y Unidad de medida */}
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

            {/* Segunda fila de inputs: Descripción y Stock */}
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
    onClick={handleSubmit}
    className={`${isEditing ? 'p-button-update' : 'p-button-agproduct'} add-button add`}
/>

            </div>
        </div>
    );
};

export default AddProductForm;
