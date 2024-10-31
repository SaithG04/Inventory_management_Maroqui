// Importación de componentes y estilos
import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Productos.css';

// Componente principal de Productos
const Productos = () => {
    // Estados del componente
    const [searchCriteria, setSearchCriteria] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [newProduct, setNewProduct] = useState(initialProductState());
    const [isEditing, setIsEditing] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(15);

    // Función para alternar el estado de `isAvailable` cada vez que se hace clic en un checkbox
    const handleAvailabilityChange = (status) => {
        setIsAvailable(prevStatus => (prevStatus === status ? null : status));
    };

    // Opciones de búsqueda
    const searchOptions = [
        { name: 'Nombre', code: 'name' },
        { name: 'Categoría', code: 'category' },
        { name: 'Proveedor', code: 'provider' }
    ];

    // Opciones de categorías
    const categoryOptions = [
        { name: 'Papelería', code: 'papeleria' },
        { name: 'Oficina', code: 'oficina' }
    ];

    // Efecto inicial para cargar los datos
    useEffect(() => {
        setProducts(initialProductData());
        setFilteredProducts(initialProductData());
    }, []);

    // Efecto para limpiar el mensaje de retroalimentación después de cierto tiempo
    useEffect(() => {
        if (feedbackMessage) {
            const timer = setTimeout(() => {
                setFeedbackMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [feedbackMessage]);

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
            { id: 2, name: 'Lápiz', category: 'Papelería', unit: 'Unidad', status: 'Sin stock', description: 'Lápiz HB', stock: 200 },
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

    // Función para limpiar los filtros de búsqueda y resetear el estado de `isAvailable`
    const handleClearSearch = () => {
        setSearchTerm('');
        setIsAvailable(null); // Limpiar el estado de disponibilidad
        setFilteredProducts(products);
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
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => setNewProduct(prev => ({ ...prev, category: e.value.name }));
    const handleStatusChange = (e) => {
        setNewProduct(prev => ({ ...prev, status: e.value.value }));
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
            setFeedbackMessage({ text: 'Producto actualizado con éxito.', type: 'success' });
        } else {
            const newProductEntry = { ...newProduct, id: products.length + 1 };
            const newProductsList = [...products, newProductEntry];
            setProducts(newProductsList);
            setFilteredProducts(newProductsList);
            setFeedbackMessage({ text: 'Producto agregado con éxito.', type: 'success' });
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
        setFeedbackMessage('');
    };

    // Validación del formulario
    const isValidProduct = () => {
        const { name, category, unit, status, description, stock } = newProduct;
        if (!name || !category || !unit || !status || !description || !stock) {
            setFeedbackMessage({ text: 'Por favor, complete todos los campos.', type: 'error' });
            return false;
        }
        return true;
    };

    // Función para editar un producto
    const handleEditProduct = (product) => {
        setNewProduct(product);
        setIsEditing(true);
        setShowAddProductForm(true);
    };

    // Función para eliminar un producto
    const handleDeleteProduct = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            const updatedProducts = products.filter(product => product.id !== id);
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            setFeedbackMessage({ text: 'Producto eliminado con éxito.', type: 'success' });
        } else {
            setFeedbackMessage({ text: 'No se eliminó el producto.', type: 'error' });
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

            <button
                onClick={handleToggleForm}
                className={`toggle-button ${showAddProductForm ? 'cancel' : 'create'}`}
            >
                {showAddProductForm ? 'Cancelar' : 'Crear Producto'}
            </button>

            {showAddProductForm && (
                <AddProductForm
                    newProduct={newProduct}
                    categoryOptions={categoryOptions}
                    handleInputChange={handleInputChange}
                    handleCategoryChange={handleCategoryChange}
                    handleStatusChange={handleStatusChange}
                    handleAddOrEditProduct={handleAddOrEditProduct}
                    feedbackMessage={feedbackMessage}
                    isEditing={isEditing}
                />
            )}

            {feedbackMessage && (
                <div className={`feedback-message feedback-${feedbackMessage.type}`}>
                    {feedbackMessage.text}
                </div>
            )}

            <DataTable
                value={filteredProducts}
                className="product-table productos-table"
                paginator
                rows={rows}
                rowsPerPageOptions={[15, 30, 50]}
                first={first}
                onPage={onPageChange}
                removableSort
            >
                <Column field="name" header="Nombre" sortable />
                <Column field="category" header="Categoría" sortable />
                <Column field="unit" header="Unidad" />
                <Column field="status" header="Estado" sortable />
                <Column field="description" header="Descripción" />
                <Column field="stock" header="Stock" />
                <Column
                    body={(rowData) => (
                        <>
                            <button className="edit-button" onClick={() => handleEditProduct(rowData)}>Editar</button>
                            <button className="delete-button" onClick={() => handleDeleteProduct(rowData.id)}>Eliminar</button>
                        </>
                    )}
                    header="Acciones"
                    className="acciones-columna"  // Agrega esta clase

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
const AddProductForm = ({ newProduct, categoryOptions, handleInputChange, handleCategoryChange, handleStatusChange, handleAddOrEditProduct, feedbackMessage, isEditing }) => {
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
                <button
                    className={`add-button ${isEditing ? 'update' : 'add'}`}
                    onClick={isEditing ? handleConfirmEdit : handleAddOrEditProduct}
                >
                    {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
                </button>
            </div>

            {feedbackMessage && (
                <div className={`feedback-message feedback-${feedbackMessage.type}`}>
                    {feedbackMessage.text}
                </div>
            )}
        </div>
    );
};

export default Productos;
