// Importación de componentes y estilos
import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'; // Importar Toast

import './Productos.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Componentes de PrimeReact
import 'primeicons/primeicons.css'; // Iconos de PrimeReact

// Componente principal de Productos
const Productos = () => {
    const [searchCriteria, setSearchCriteria] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [newProduct, setNewProduct] = useState(initialProductState());
    const [isEditing, setIsEditing] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(15);
    const searchInputRef = useRef(null);
    const toast = useRef(null); // Referencia para el Toast

    // Opciones de búsqueda y categorías
    const searchOptions = [
        { name: 'Nombre', code: 'name' },
        { name: 'Categoría', code: 'category' },
        { name: 'Descripcion', code: 'description' }
    ];
    const categoryOptions = [
        { name: 'Papelería', code: 'papeleria' },
        { name: 'Oficina', code: 'oficina' }
    ];

    // Función para alternar el estado de isAvailable cada vez que se hace clic en un checkbox
    const handleAvailabilityChange = (status) => {
        setIsAvailable(prevStatus => (prevStatus === status ? null : status));
    };

    // Efecto inicial para cargar los datos
    useEffect(() => {
        setProducts(initialProductData());
        setFilteredProducts(initialProductData());
    }, []);

    // Estado inicial para el producto
    function initialProductState() {
        return {
            name: '',
            category: '',
            unit: '',
            status: '',
            description: '',
            stock: ''
        };
    }

    // Datos iniciales de ejemplo para productos
    function initialProductData() {
        return [
            { id: 1, name: 'Cuaderno', category: 'Papelería', unit: 'Unidad', status: 'Activo', description: 'Cuaderno A4', stock: 100 },
            { id: 2, name: 'Lápiz', category: 'Papelería', unit: 'Unidad', status: 'Sin stock', description: 'Lápiz HB', stock: 0 },
            { id: 3, name: 'Borrador', category: 'Papelería', unit: 'Unidad', status: 'Activo', description: 'Borrador blanco', stock: 50 },
            { id: 4, name: 'Tijeras', category: 'Oficina', unit: 'Unidad', status: 'Descontinuado', description: 'Tijeras escolares', stock: 30 }
        ];
    }

    // Función de búsqueda actualizada
    const handleSearch = () => {
        let results = products;
        if (searchCriteria && searchTerm) {
            results = results.filter(product =>
                product[searchCriteria.code]?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (isAvailable) {
            results = results.filter(product => product.status === isAvailable);
        }
        setFilteredProducts(results);
    };

    // Función para limpiar los filtros de búsqueda
    const handleClearSearch = () => {
        setSearchTerm('');  // Limpia el término de búsqueda
        setIsAvailable(null);  // Restablece la disponibilidad
        setSearchCriteria(null); // Restablece el dropdown a su valor inicial
        setFilteredProducts(products);  // Muestra todos los productos

        // Establecer el foco al campo de búsqueda cuando el usuario lo necesite explícitamente
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };


    // Función para alternar el formulario de creación/edición de producto
    const handleToggleForm = () => {
        if (showAddProductForm && isFormNotEmpty()) {
            if (window.confirm('Hay datos en el formulario. ¿Estás seguro de que deseas cancelar?')) {
                clearForm();
                setShowAddProductForm(false);
            }
        } else {
            setShowAddProductForm(prev => !prev);
        }
    };

    // Manejo de cambios en los campos de entrada del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: name === "stock" ? parseInt(value) : value,
            status: name === "stock" && parseInt(value) === 0 ? "Sin stock" : prev.status // Auto-ajusta estado si stock es 0
        }));
    };

    const handleCategoryChange = (e) => setNewProduct(prev => ({ ...prev, category: e.value.name }));
    const handleStatusChange = (e) => {
        setNewProduct(prev => ({ ...prev, status: e.value }));
    };

    // Función para agregar o editar un producto
    const handleAddOrEditProduct = () => {
        if (!isValidProduct()) return;

        if (isEditing) {
            const updatedProducts = products.map(product =>
                product.id === newProduct.id ? { ...product, ...newProduct } : product
            );
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            toast.current.show({ severity: 'success', summary: 'Producto Actualizado', detail: 'Producto actualizado con éxito.', life: 3000 });
        } else {
            const newProductEntry = { ...newProduct, id: products.length + 1 };
            const newProductsList = [...products, newProductEntry];
            setProducts(newProductsList);
            setFilteredProducts(newProductsList);
            toast.current.show({ severity: 'success', summary: 'Producto Agregado', detail: 'Producto agregado con éxito.', life: 3000 });
        }

        setTimeout(() => {
            clearForm();
            setShowAddProductForm(false);
        }, 1000);
    };

    // Función para limpiar el formulario
    const clearForm = () => {
        setNewProduct(initialProductState());
        setIsEditing(false);
    };

    // Validación del formulario
    const isValidProduct = () => {
        const { name, category, unit, status, description, stock } = newProduct;
        if (!name || !category || !unit || !status || !description || stock === '') {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos.', life: 3000 });
            return false;
        }
        return true;
    };

    // Función para editar un producto
    const handleEdit = (product) => {
        setNewProduct(product);
        setIsEditing(true);
        setShowAddProductForm(true);
    };

    // Función para eliminar un producto
    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            const updatedProducts = products.filter((product) => product.id !== id);
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            toast.current.show({ severity: 'success', summary: 'Producto Eliminado', detail: 'Producto eliminado con éxito.', life: 3000 });
        }
    };

    // Comprobación de formulario no vacío
    const isFormNotEmpty = () => {
        const { name, category, unit, status, description, stock } = newProduct;
        return name || category || unit || status || description || stock;
    };

    // Función para el cambio de página y filas
    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    // Renderizado del componente
    return (
        <div className="productos-container">
            <Toast ref={toast} /> {/* Agregar Toast aquí */}

            <h2>Productos</h2>

            <SearchSection
                searchOptions={searchOptions}
                searchCriteria={searchCriteria}
                setSearchCriteria={setSearchCriteria}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isAvailable={isAvailable}
                handleAvailabilityChange={handleAvailabilityChange}
                handleSearch={handleSearch}
                handleClearSearch={handleClearSearch}
            />

            {/* Botón para Mostrar/Ocultar Formulario de Crear Producto */}
            <div className="product-toggle-form">
                <Button
                    label={showAddProductForm ? 'Cancelar' : 'Crear Producto'}
                    icon={showAddProductForm ? 'pi pi-times' : 'pi pi-plus'}
                    onClick={handleToggleForm}
                    className={showAddProductForm ? 'p-button-danger' : 'p-button-success'}
                />
            </div>

            {showAddProductForm && (
                <AddProductForm
                    newProduct={newProduct}
                    categoryOptions={categoryOptions}
                    handleInputChange={handleInputChange}
                    handleCategoryChange={handleCategoryChange}
                    handleStatusChange={handleStatusChange}
                    handleAddOrEditProduct={handleAddOrEditProduct}
                    isEditing={isEditing}
                />
            )}

            <DataTable
                value={filteredProducts}
                style={{ margin: "0 auto", width: "100%" }} // Centra la tabla en el componente
                className="product-table productos-table"
                paginator
                rows={rows}
                rowsPerPageOptions={[15, 30, 50]}
                first={first}
                onPage={onPageChange}
                removableSort
                paginatorClassName="custom-paginator" // Añadir clase específica al paginator
            >
                <Column field="name" header="Nombre" sortable headerClassName="center-header" bodyClassName="center-body" />
                <Column field="category" header="Categoría" sortable headerClassName="center-header" bodyClassName="center-body" />
                <Column field="unit" header="Unidad" headerClassName="center-header" bodyClassName="center-body" />
                <Column field="status" header="Estado" sortable headerClassName="center-header" bodyClassName="center-body" />
                <Column
                    field="description"
                    header="Descripción"
                    headerClassName="center-header"
                    bodyClassName="center-body"
                    body={rowData => (
                        <div className="description-wrapper">
                            <span className="description-cell">
                                {rowData.description}
                            </span>
                            <div className="custom-tooltip">{rowData.description}</div>
                        </div>
                    )}
                />



                <Column field="stock" header="Stock" headerClassName="center-header" bodyClassName="center-body" />
                <Column
                    body={(rowData) => (
                        <>
                            <Button
                                icon="pi pi-pencil"
                                label="Editar"
                                className="products-button-edit p-button-rounded p-button-text"
                                onClick={() => handleEdit(rowData)}
                            />
                            <Button
                                icon="pi pi-trash"
                                label="Eliminar"
                                className="products-button-delete p-button-rounded p-button-text"
                                severity="danger"
                                onClick={() => handleDelete(rowData.id)}
                            />
                        </>
                    )}
                />
            </DataTable>
        </div>
    );
};

// Componente de Sección de Búsqueda
const SearchSection = ({
    searchOptions,
    searchCriteria,
    setSearchCriteria,
    searchTerm,
    setSearchTerm,
    isAvailable,
    handleAvailabilityChange,
    handleSearch,
    handleClearSearch
}) => {
    return (
        <div className="search-section">
            <Dropdown
                className="search-dropdown"
                value={searchCriteria}
                options={searchOptions}
                onChange={(e) => setSearchCriteria(e.value)}
                optionLabel="name"
                placeholder="Selecciona un criterio"
            />

            <input
                type="text"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
            />
            <button onClick={handleSearch} className="search-button">Buscar</button>
            <button onClick={handleClearSearch} className="clear-button">Limpiar</button>

            <div className="checkbox-group">
                <div className="checkbox-item">
                    <Checkbox
                        inputId="activo"
                        checked={isAvailable === 'Activo'}
                        onChange={() => handleAvailabilityChange('Activo')}
                    />
                    <label htmlFor="activo">Activo</label>
                </div>
                <div className="checkbox-item">
                    <Checkbox
                        inputId="sinStock"
                        checked={isAvailable === 'Sin stock'}
                        onChange={() => handleAvailabilityChange('Sin stock')}
                    />
                    <label htmlFor="sinStock">Sin stock</label>
                </div>
            </div>
        </div>
    );
};

// Componente de Formulario para Agregar o Editar Producto
const AddProductForm = ({ newProduct, categoryOptions, handleInputChange, handleCategoryChange, handleStatusChange, handleAddOrEditProduct, isEditing }) => {
    const handleConfirmEdit = () => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas actualizar este producto?");
        if (isConfirmed) {
            handleAddOrEditProduct();
        }
    };

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
                    value={categoryOptions.find(cat => cat.name === newProduct.category)}
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    optionLabel="name"
                    placeholder="Selecciona una categoría"
                    className="category-dropdown"
                />
                <Dropdown
                    value={newProduct.status} // Asegúrate de que esté leyendo directamente el valor de `status`
                    options={[
                        { name: 'Activo', value: 'Activo' },
                        { name: 'Descontinuado', value: 'Descontinuado' },
                        { name: 'Sin stock', value: 'Sin stock' }
                    ]}
                    onChange={(e) => handleStatusChange(e)}
                    optionLabel="name"
                    placeholder="Selecciona un estado"
                    className="status-dropdown"
                />
            </div>

            <div className="add-product-section">
                <Button
                    label={isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
                    icon="pi pi-check"
                    onClick={isEditing ? handleConfirmEdit : handleAddOrEditProduct}
                    className={isEditing ? 'p-button-update' : 'p-button-success'}
                />
            </div>
        </div>
    );
};

export default Productos;
