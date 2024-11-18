import React, { useState, useEffect, useRef, useContext } from 'react';
import { ProductContext } from '../../context/ProductContext';
import SearchSection from './components/search-section/SearchSection';
import AddProductForm from './components/add-product-form/AddProductForm';
import ProductTable from './components/product-table/ProductTable';
import CreateCategoryForm from './components/add-category-form/CreateCategoryForm';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import './Productos.css';
import { handleAddOrEditItem, handleDeleteItem } from '../shared/actionbutton/buttonFunctions';


const Productos = ({ userRole }) => {
    const { products, addProduct, updateProduct, deleteProduct, categoryOptions, addCategory } = useContext(ProductContext);
    const toast = useRef(null);

    const [searchCriteria, setSearchCriteria] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        id: '',
        name: '',
        price: '',
        stock: '',
        category: '',
        unit: '',
        status: '',
        description: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(15);

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handleAddProductClick = () => {
        if (showAddProductForm) {
            setShowAddProductForm(false);
            setIsEditing(false);
            resetNewProduct();
        } else {
            if (showCreateCategoryForm) setShowCreateCategoryForm(false);
            resetNewProduct();
            setIsEditing(false);
            setShowAddProductForm(true);
        }
    };

    const resetNewProduct = () => {
        setNewProduct({
            id: '',
            name: '',
            price: '',
            stock: '',
            category: '',
            unit: '',
            status: '',
            description: ''
        });
    };

    const handleCreateCategoryClick = () => {
        if (showCreateCategoryForm) {
            setShowCreateCategoryForm(false);
        } else {
            if (showAddProductForm) setShowAddProductForm(false);
            setShowCreateCategoryForm(true);
        }
    };

    const handleAddOrEditProductLocal = () => {
        const updatedProduct = {
            ...newProduct,
            category: typeof newProduct.category === 'object' ? newProduct.category?.name : newProduct.category,
            description: newProduct.description ? newProduct.description : "Sin descripción"
        };

        const successMessages = {
            addSummary: "Producto agregado",
            addDetail: "El nuevo producto ha sido agregado correctamente.",
            editSummary: "Producto editado",
            editDetail: "Los detalles del producto han sido actualizados correctamente."
        };

        console.log("Datos del producto antes de agregar/editar:", updatedProduct); // Log para depurar y verificar datos

        // Cambié aquí handleAddOrEditProduct por handleAddOrEditItem
        handleAddOrEditItem(
            updatedProduct,
            isEditing,
            addProduct,
            updateProduct,
            toast,
            setShowAddProductForm,
            successMessages // Pasamos los mensajes personalizados
        );
    };

    const handleEditItem = (product) => {
        const selectedCategory = categoryOptions.find(cat => cat.name === product.category) || null;
        setNewProduct({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: selectedCategory,
            unit: product.unit,
            status: product.status,
            description: product.description
        });
        setIsEditing(true);
        setShowAddProductForm(true);
    };



    return (
        <div className="productos-container">
            <Toast ref={toast} />

            {/* Título de la sección de Productos */}
            <h2 className="productos-title">Gestión de Productos</h2>

            {/* Sección de búsqueda */}
            <SearchSection
                searchOptions={[{ name: 'Nombre', code: 'name' }, { name: 'Categoría', code: 'category' }, { name: 'Descripción', code: 'description' }]}
                searchCriteria={searchCriteria}
                setSearchCriteria={setSearchCriteria}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isAvailable={isAvailable}
                setIsAvailable={setIsAvailable}
                setFilteredProducts={setFilteredProducts}
                products={products}
                toast={toast}
            />

            <div className="button-container products-and-categories">
                <Button
                    label={showAddProductForm ? "Cancelar" : "Agregar Producto"}
                    icon={showAddProductForm ? "pi pi-times" : "pi pi-plus"}
                    onClick={handleAddProductClick}
                    className={showAddProductForm ? "cancel-product-button" : "add-product-button"}
                />

                <Button
                    label={showCreateCategoryForm ? "Cancelar" : "Crear Categoría"}
                    icon={showCreateCategoryForm ? "pi pi-times" : "pi pi-plus"}
                    onClick={handleCreateCategoryClick}
                    className={showCreateCategoryForm ? "cancel-category-button" : "add-category-button"}
                />
            </div>



            {showAddProductForm && (
                <AddProductForm
                    newProduct={newProduct}
                    categoryOptions={categoryOptions}
                    handleInputChange={(e) => {
                        const { name, value } = e.target;
                        setNewProduct((prev) => ({
                            ...prev,
                            [name]: value,
                        }));
                    }}
                    handleCategoryChange={(e) =>
                        setNewProduct((prev) => ({
                            ...prev,
                            category: e.value,
                        }))
                    }
                    handleStatusChange={(e) =>
                        setNewProduct((prev) => ({
                            ...prev,
                            status: e.value,
                        }))
                    }
                    handleAddOrEditProduct={handleAddOrEditProductLocal}
                    isEditing={isEditing}
                />
            )}

            {showCreateCategoryForm && (
                <CreateCategoryForm
                    addCategory={addCategory}
                    setShowCreateCategoryForm={setShowCreateCategoryForm}
                    toast={toast}
                />
            )}

            <ProductTable
                products={filteredProducts}
                rows={rows}
                first={first}
                onPageChange={handlePageChange}
                handleEdit={(product) => handleEditItem(product)}
                handleDelete={(productId) => {
                    const successMessages = {
                        deleteSummary: 'Producto Eliminado',
                        deleteDetail: 'El producto ha sido eliminado con éxito.'
                    };
                    handleDeleteItem(productId, deleteProduct, toast, successMessages);
                }}
                isVendedor={userRole === 'Vendedor'}
            />
        </div>
    );
};

export default Productos;
