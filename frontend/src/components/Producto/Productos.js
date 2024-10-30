import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Productos.css';

const Productos = () => {
    const [searchCriteria, setSearchCriteria] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [isNotAvailable, setIsNotAvailable] = useState(false);
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [newProduct, setNewProduct] = useState(initialProductState());
    const [isEditing, setIsEditing] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');


    const searchOptions = [
        { name: 'Nombre', code: 'name' },
        { name: 'Categoría', code: 'category' },
        { name: 'Proveedor', code: 'provider' }
    ];

    const categoryOptions = [
        { name: 'Papelería', code: 'papeleria' },
        { name: 'Oficina', code: 'oficina' }
    ];

    useEffect(() => {
        // Datos iniciales de productos
        setProducts(initialProductData());
        setFilteredProducts(initialProductData());
    }, []);

    // Efecto para limpiar el mensaje de retroalimentación
    useEffect(() => {
        // Temporizador para limpiar el mensaje de retroalimentación
        if (feedbackMessage) {
            const timer = setTimeout(() => {
                setFeedbackMessage('');
            }, 3000); // Cambia 3000 a la duración que desees en milisegundos

            return () => clearTimeout(timer); // Limpia el temporizador si el mensaje cambia o si el componente se desmonta
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
            stock: '',
            cost: '',
            price: ''
        };
    }

    function initialProductData() {
        return [
            { id: 1, name: 'Cuaderno', category: 'Papelería', unit: 'Unidad', status: 'Disponible', description: 'Cuaderno A4', stock: 100, cost: 1.5, price: 2.0 },
            { id: 2, name: 'Lápiz', category: 'Papelería', unit: 'Unidad', status: 'No Disponible', description: 'Lápiz HB', stock: 200, cost: 0.5, price: 1.0 },
            { id: 3, name: 'Borrador', category: 'Papelería', unit: 'Unidad', status: 'Disponible', description: 'Borrador blanco', stock: 50, cost: 0.3, price: 0.8 },
            { id: 4, name: 'Tijeras', category: 'Oficina', unit: 'Unidad', status: 'Disponible', description: 'Tijeras escolares', stock: 30, cost: 2.0, price: 3.5 },
            { id: 4, name: 'Tijeras', category: 'Oficina', unit: 'Unidad', status: 'Disponible', description: 'Tijeras escolares', stock: 30, cost: 2.0, price: 3.5 },
            { id: 4, name: 'Tijeras', category: 'Oficina', unit: 'Unidad', status: 'Disponible', description: 'Tijeras escolares', stock: 30, cost: 2.0, price: 3.5 },
        ];
    }

    const handleSearch = () => {
        let results = products;
        if (searchCriteria && searchTerm) {
            results = results.filter(product =>
                product[searchCriteria.code]?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (isAvailable) results = results.filter(product => product.status === 'Disponible');
        else if (isNotAvailable) results = results.filter(product => product.status === 'No Disponible');

        setFilteredProducts(results);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setFilteredProducts(products);
    };

    const handleAvailabilityChange = (type) => {
        if (type === 'available') {
            setIsAvailable(prev => !prev);
            setIsNotAvailable(false);
        } else {
            setIsNotAvailable(prev => !prev);
            setIsAvailable(false);
        }
    };

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => setNewProduct(prev => ({ ...prev, category: e.value.name }));
    const handleStatusChange = (e) => {
        setNewProduct(prev => ({ ...prev, status: e.value.value })); // Asegúrate de acceder al valor correcto
    };

    const handleAddOrEditProduct = () => {
        if (!isValidProduct()) return;
    
        // Variable para el mensaje de retroalimentación
        let feedbackMessage = { text: '', type: 'success' };
    
        if (isEditing) {
            const updatedProducts = products.map(product =>
                product.id === newProduct.id ? { ...product, ...newProduct } : product
            );
            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            feedbackMessage.text = 'Producto actualizado con éxito.'; // Asigna el mensaje
        } else {
            const newProductEntry = { ...newProduct, id: products.length + 1 };
            const newProductsList = [...products, newProductEntry];
            setProducts(newProductsList);
            setFilteredProducts(newProductsList);
            feedbackMessage.text = 'Producto agregado con éxito.'; // Asigna el mensaje
        }
    
        setFeedbackMessage(feedbackMessage); // Establece el mensaje de éxito
        clearForm();
        setShowAddProductForm(false);
    };
    
    


    const clearForm = () => {
        setNewProduct(initialProductState());
        setIsEditing(false);
        setFeedbackMessage('');
    };


    const isValidProduct = () => {
        const { name, category, unit, status, description, stock, cost, price } = newProduct;
        if (!name || !category || !unit || !status || !description || !stock || !cost || !price) {
            setFeedbackMessage({ text: 'Por favor, complete todos los campos.', type: 'error' });
            return false;
        }
        return true;
    };

    const handleEditProduct = (product) => {
        setNewProduct(product);
        setIsEditing(true);
        setShowAddProductForm(true);
    };



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



    const isFormNotEmpty = () => {
        const { name, category, unit, status, description, stock, cost, price } = newProduct;
        return name || category || unit || status || description || stock || cost || price;
    };

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
                isNotAvailable={isNotAvailable}
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
                    categoryOptions={categoryOptions} // Pasar las opciones de categoría
                    handleInputChange={handleInputChange}
                    handleCategoryChange={handleCategoryChange}
                    handleStatusChange={handleStatusChange}
                    handleAddOrEditProduct={handleAddOrEditProduct}
                    feedbackMessage={feedbackMessage}
                    isEditing={isEditing}
                />
            )}

            {/* Renderiza el mensaje de retroalimentación aquí */}
            {feedbackMessage && (
                <div className={`feedback-message feedback-${feedbackMessage.type}`}>
                    {feedbackMessage.text} {/* Solo renderiza el texto del mensaje */}
                </div>
            )}

            <div className="product-table">
                <DataTable
                    value={filteredProducts} // Muestra solo los proveedores filtrados
                    responsiveLayout="scroll"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25]}
                >
                                  <Column field="name" header="Nombre" />
                <Column field="category" header="Categoría" />
                <Column field="unit" header="Unidad" />
                <Column field="status" header="Estado" />
                <Column field="description" header="Descripción" />
                <Column field="stock" header="Stock" />
                <Column field="cost" header="Costo" />
                <Column field="price" header="Precio" />
                <Column
                    body={(rowData) => (
                        <>
                            <button className="edit-button" onClick={() => handleEditProduct(rowData)}>Editar</button>
                            <button className="delete-button" onClick={() => handleDeleteProduct(rowData.id)}>Eliminar</button>
                        </>
                    )}
                    header="Acciones"
                />
                </DataTable>
            </div>
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
    isNotAvailable,
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

            {/* Checkboxes alineados horizontalmente */}
            <div className="checkbox-group">
                <div className="checkbox-item">
                    <Checkbox
                        inputId="available"
                        checked={isAvailable}
                        onChange={() => handleAvailabilityChange('available')}
                    />
                    <label htmlFor="available">Disponible</label>
                </div>

                <div className="checkbox-item">
                    <Checkbox
                        inputId="notAvailable"
                        checked={isNotAvailable}
                        onChange={() => handleAvailabilityChange('notAvailable')}
                    />
                    <label htmlFor="notAvailable">No Disponible</label>
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
                    className="input-name"  // Clase específica para el nombre
                />
                <input
                    type="text"
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleInputChange}
                    placeholder="Unidad de medida"
                    className="input-unit-measurement"  // Clase específica para la unidad de medida
                />
            </div>
            <div className="form-row">
                <input
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Descripción"
                    className="input-description"  // Clase específica para la descripción
                />
                <Dropdown
                    value={categoryOptions.find(cat => cat.name === newProduct.category)}
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    optionLabel="name"
                    placeholder="Selecciona una categoría"
                    className="category-dropdown"
                />
            </div>

            <div className="form-row">
                <Dropdown
                    value={newProduct.status}
                    options={[
                        { name: 'Disponible', value: 'Disponible' },
                        { name: 'No Disponible', value: 'No Disponible' }
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

            {/* Ajuste para mostrar el mensaje de retroalimentación correctamente */}
            {feedbackMessage && (
                <div className={`feedback-message feedback-${feedbackMessage.type}`}>
                    {feedbackMessage.text} {/* Asegúrate de acceder al texto */}
                </div>
            )}
        </div>
    );
};

export default Productos;
