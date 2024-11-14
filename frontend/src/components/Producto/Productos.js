// Importación de componentes y estilos
import React, { useState, useEffect, useRef, useContext } from "react";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProductContext } from '../../context/ProductContext'; // Importar el contexto

import './Productos.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Componentes de PrimeReact
import 'primeicons/primeicons.css'; // Iconos de PrimeReact

// Componente principal de Productos
const Productos = ({ userRole }) => {
    const { products, addProduct, updateProductStock, deleteProduct, categoryOptions, addCategory } = useContext(ProductContext);
    const isVendedor = userRole === 'Vendedor';
    const [searchCriteria, setSearchCriteria] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [newProduct, setNewProduct] = useState(initialProductState());
    const [isEditing, setIsEditing] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(15);
    const [newCategory, setNewCategory] = useState('');
    const searchInputRef = useRef(null);
    const toast = useRef(null);

    const searchOptions = [
        { name: 'Nombre', code: 'name' },
        { name: 'Categoría', code: 'category' },
        { name: 'Descripcion', code: 'description' }
    ];

    // Efecto para filtrar productos
    useEffect(() => {
        // Cada vez que los productos del contexto cambien, actualiza filteredProducts
        setFilteredProducts(products);
    }, [products]);

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
    

    const handleAvailabilityChange = (status) => {
        setIsAvailable(prevStatus => (prevStatus === status ? null : status));
    };

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

    const handleClearSearch = () => {
        setSearchTerm('');
        setIsAvailable(null);
        setSearchCriteria(null);
        setFilteredProducts(products);

        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleToggleForm = () => {
        if (showAddProductForm && isFormNotEmpty()) {
            confirmDialog({
                message: 'Hay datos ingresados en el formulario. ¿Seguro que deseas cancelar?',
                header: 'Confirmación de Cancelación',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                acceptClassName: 'custom-accept-button',
                rejectClassName: 'custom-reject-button',
                accept: () => {
                    clearForm();
                    setShowAddProductForm(false);
                },
                reject: () => {}
            });
        } else {
            setShowAddProductForm(prev => !prev);
        }
    };

    const handleToggleCategoryForm = () => {
        if (showAddCategoryForm && newCategory.trim() !== '') {
            confirmDialog({
                message: 'Hay datos ingresados en el formulario. ¿Seguro que deseas cancelar?',
                header: 'Confirmación de Cancelación',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                acceptClassName: 'custom-accept-button',
                rejectClassName: 'custom-reject-button',
                accept: () => {
                    setNewCategory('');
                    setShowAddCategoryForm(false);
                },
                reject: () => {}
            });
        } else {
            setShowAddCategoryForm(prev => !prev);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: name === "stock" ? parseInt(value) : value,
            status: name === "stock" && parseInt(value) === 0 ? "Sin stock" : prev.status
        }));
    };

    const handleCategoryChange = (e) => setNewProduct(prev => ({ ...prev, category: e.value.name }));
    const handleStatusChange = (e) => setNewProduct(prev => ({ ...prev, status: e.value }));

    const handleAddOrEditProduct = () => {
        if (!isValidProduct()) return;
    
        const productToAdd = {
            ...newProduct,
            id: isEditing ? newProduct.id : Date.now(),
        };
    
        if (isEditing) {
            updateProductStock(productToAdd.id, productToAdd.stock); // Usar updateProductStock para actualizar
        } else {
            addProduct(productToAdd); // Usar addProduct para agregar un nuevo producto
        }
    
        toast.current.show({
            severity: 'success',
            summary: 'Producto Actualizado',
            detail: 'El inventario ha sido actualizado con éxito.',
            life: 3000,
        });
    
        setShowAddProductForm(false);
        clearForm();
    };
    
    
    
    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, ingrese un nombre de categoría.', life: 3000 });
            return;
        }

        if (categoryOptions && categoryOptions.some(category => category.name.toLowerCase() === newCategory.toLowerCase())) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La categoría ya existe.', life: 3000 });
            return;
        }

        addCategory({ name: newCategory, code: newCategory.toLowerCase() });
        toast.current.show({ severity: 'success', summary: 'Categoría Agregada', detail: 'Categoría agregada con éxito.', life: 3000 });
        setNewCategory('');
        setShowAddCategoryForm(false);
    };

    const clearForm = () => {
        setNewProduct(initialProductState());
        setIsEditing(false);
    };

    const isValidProduct = () => {
        const { name, category, unit, status, stock } = newProduct;
        if (!name || !category || !unit || status === '' || stock === '') {
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, complete todos los campos obligatorios.',
                life: 3000
            });
            return false;
        }
        return true;
    };
    

    const handleEdit = (product) => {
        confirmDialog({
            message: '¿Estás seguro de que deseas actualizar este producto?',
            header: 'Confirmación de Actualización',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'custom-accept-button',
            rejectClassName: 'custom-reject-button',
            accept: () => {
                setNewProduct(product);
                setIsEditing(true);
                setShowAddProductForm(true);
            },
            reject: () => {}
        });
    };

    const handleDelete = (id) => {
        confirmDialog({
            message: '¿Estás seguro de que deseas eliminar este producto?',
            header: 'Confirmación de Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'custom-accept-button',
            rejectClassName: 'custom-reject-button',
            accept: () => {
                deleteProduct(id); // Usar función del contexto para eliminar
                toast.current.show({ severity: 'success', summary: 'Producto Eliminado', detail: 'Producto eliminado con éxito.', life: 3000 });
            },
            reject: () => {}
        });
    };

    const isFormNotEmpty = () => {
        const { name, category, unit, status, description, stock } = newProduct;
        return name || category || unit || status || description || stock;
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    return (
        <div className="productos-container">
            <ConfirmDialog />
            <Toast ref={toast} />

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

            <div className="product-toggle-form">
                <Button
                    label={showAddProductForm ? 'Cancelar' : 'Crear Producto'}
                    icon={showAddProductForm ? 'pi pi-times' : 'pi pi-plus'}
                    onClick={handleToggleForm}
                    className={showAddProductForm ? 'p-button-danger' : 'p-button-success'}
                    disabled={isVendedor}
                />
                <Button
                    label={showAddCategoryForm ? 'Cancelar' : 'Crear Categoría'}
                    icon={showAddCategoryForm ? 'pi pi-times' : 'pi pi-plus'}
                    onClick={handleToggleCategoryForm}
                    className={showAddCategoryForm ? 'p-button-danger' : 'p-button-success'}
                    style={{ marginLeft: '10px' }}
                    disabled={isVendedor}
                />
            </div>

            {showAddCategoryForm && (
                <div className="add-category-form">
                    <h3>Agregar Categoría</h3>
                    <div className="form-row">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Nombre de la Categoría"
                            className="input-category-name"
                        />
                        <Button
                            label="Agregar Categoría"
                            icon="pi pi-check"
                            onClick={handleAddCategory}
                            className="p-button-agproduct"
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                </div>
            )}

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
    style={{ margin: "0 auto", width: "100%" }}
    className="product-table productos-table"
    paginator
    rows={rows}
    rowsPerPageOptions={[15, 30, 50]}
    first={first}
    onPage={onPageChange}
    removableSort
    paginatorClassName="custom-paginator"
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
            <div className="product-button-container">
                <Button
                    icon="pi pi-pencil"
                    label="Editar"
                    className="products-button-edit p-button-rounded p-button-text"
                    onClick={() => handleEdit(rowData)}
                    disabled={isVendedor}
                />
                <Button
                    icon="pi pi-trash"
                    label="Eliminar"
                    className="products-button-delete p-button-rounded p-button-text"
                    severity="danger"
                    onClick={() => handleDelete(rowData.id)}
                    disabled={isVendedor}
                />
            </div>
        )}
    />
</DataTable>

        </div>
    );
};

// Componente de Sección de Búsqueda
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

            <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-search" />
                </span>
                <InputText
                    type="text"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                />
            </div>
            
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
const AddProductForm = ({ newProduct, categoryOptions = [], handleInputChange, handleCategoryChange, handleStatusChange, handleAddOrEditProduct, isEditing }) => {
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
                    onClick={handleAddOrEditProduct}
                    className={isEditing ? 'p-button-update' : 'p-button-agproduct'}
                />
            </div>
        </div>
    );
};


export default Productos;
