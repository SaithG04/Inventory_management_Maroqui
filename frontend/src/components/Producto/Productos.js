import React, { useState, useEffect, useRef, useCallback } from 'react';
import SearchSection from './components/search-section/SearchSection';
import AddProductForm from './components/add-product-form/AddProductForm';
import ProductTable from './components/product-table/ProductTable';
import CategoryManager from './components/category-manager/CategoryManager';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import './Productos.css';

const Productos = ({ userRole }) => {
    const productToast = useRef(null);

    // Estados principales
    const [originalProducts, setOriginalProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [showProductTable, setShowProductTable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isToastShown, setIsToastShown] = useState(false); // Estado para controlar si ya se mostró el toast
    const [newProduct, setNewProduct] = useState({
        id_producto: '',        // Solo se usa en modo de edición
        nombre: '',
        unidad_medida: '',
        descripcion: '',
        stock: '0',             // Valor inicial de stock
        id_categoria: '',       // Debe tener un valor válido una vez seleccionado
        estado: 'ACTIVE',       // Valor por defecto
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(15);

    // Función para cargar productos
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const productList = await ProductService.listProducts();
            setOriginalProducts(productList || []);
            setProducts(enrichProductsWithCategory(productList || [], categories));
        } catch {
            productToast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los productos.',
            });
        } finally {
            setLoading(false);
        }
    }, [categories]);

    // Función para cargar categorías
    const fetchCategories = useCallback(async () => {
        try {
            const categoryList = await CategoryService.listCategories();
            setCategories(categoryList || []);
        } catch {
            productToast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar las categorías.',
            });
        }
    }, []);

    // Mostrar Toast solo una vez cuando la carga de productos se complete por primera vez
    useEffect(() => {
        if (!loading && products.length > 0 && !isToastShown) {
            productToast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Productos cargados correctamente.',
            });
            setIsToastShown(true); // Marcar que el toast ya fue mostrado
        }
    }, [loading, products, isToastShown]);

    useEffect(() => {
        if (showProductTable) {
            // Solo carga categorías y productos si no se ha hecho ya
            if (categories.length === 0) {
                fetchCategories();
            }
            if (originalProducts.length === 0) {
                fetchProducts();
            }
        }
    }, [showProductTable, categories.length, originalProducts.length, fetchCategories, fetchProducts]);
    

    const enrichProductsWithCategory = (products, categories) => {
        return products.map(product => {
            const category = categories.find(cat => cat.id_categoria === product.id_categoria);
            return {
                ...product,
                categoria_nombre: category ? category.nombre : 'Sin Categoría',
            };
        });
    };

    const handleViewChange = (view) => {
        setShowProductTable(view === 'products');
        setShowAddProductForm(false);
        setIsToastShown(false); // Resetear la bandera para que se muestre nuevamente si se cambia de vista
    };

    const handleAddProductClick = () => {
        setShowAddProductForm(!showAddProductForm);
        if (!showAddProductForm) {
            resetNewProduct();
            setIsEditing(false);
        }
    };

    const resetNewProduct = () => {
        setNewProduct({
            id_producto: '',
            nombre: '',
            precio: '',
            stock: '',
            id_categoria: '',
            unidad_medida: '',
            estado: 'Activo',
            descripcion: '',
        });
    };

    const handleAddOrEditProduct = async () => {
        // Crear el objeto producto con todos los campos necesarios para el backend
        const productToSave = {
            nombre: newProduct.nombre || '',
            id_categoria: newProduct.id_categoria || '',
            descripcion: newProduct.descripcion || null,
            unidad_medida: newProduct.unidad_medida || 'UN', // Valor predeterminado "UN"
            stock: newProduct.stock || 0,
            estado: newProduct.estado || 'ACTIVE', // Valor predeterminado "ACTIVE"
        };
    
        console.log("Datos del producto a enviar:", productToSave);
    
        try {
            if (isEditing) {
                await ProductService.updateProduct(newProduct.id_producto, productToSave);
                productToast.current.show({
                    severity: 'success',
                    summary: 'Producto Actualizado',
                    detail: 'El producto fue actualizado con éxito.',
                });
            } else {
                await ProductService.saveProduct(productToSave);
                productToast.current.show({
                    severity: 'success',
                    summary: 'Producto Agregado',
                    detail: 'El producto fue agregado con éxito.',
                });
            }
            await fetchProducts();
            setShowAddProductForm(false);
        } catch (error) {
            productToast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo guardar el producto.',
            });
        }
    };
    
    
    
    

    const handleEditProduct = (product) => {
        setNewProduct({
            id_producto: product.id_producto,
            nombre: product.nombre,
            precio: product.precio,
            stock: product.stock,
            id_categoria: product.id_categoria,
            unidad_medida: product.unidad_medida,
            estado: product.estado,
            descripcion: product.descripcion,
        });
        setIsEditing(true);
        setShowAddProductForm(true);
    };

    const handleStatusChange = (e) => {
        setNewProduct((prev) => ({
            ...prev,
            estado: e.value,
        }));
    };

    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    return (
        <div className="productos-container">
            <Toast ref={productToast} />
            <h2 className="productos-title">Gestión de Productos y Categorías</h2>
            <SearchSection
                searchOptions={showProductTable ? [
                    { name: 'Nombre', code: 'nombre' },
                    { name: 'Categoría', code: 'id_categoria' },
                    { name: 'Estado', code: 'estado' },
                ] : [
                    { name: 'Nombre de Categoría', code: 'nombre' },
                    { name: 'Estado', code: 'estado' },
                ]}
                searchCriteria={searchCriteria}
                setSearchCriteria={setSearchCriteria}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setFilteredProducts={setProducts}
                products={originalProducts}
                categories={categories} // Pasa las categorías aquí
                toast={productToast}
                showProductTable={showProductTable}
            />
            <div className="button-container products-and-categories">
                <Button
                    label="Ver Productos"
                    icon="pi pi-box"
                    className={showProductTable ? 'p-button-success' : 'p-button-secondary'}
                    onClick={() => handleViewChange('products')}
                />
                <Button
                    label="Ver Categorías"
                    icon="pi pi-tags"
                    className={!showProductTable ? 'p-button-success' : 'p-button-secondary'}
                    onClick={() => handleViewChange('categories')}
                />
            </div>
            {showProductTable && (
                <Button
                    label={showAddProductForm ? 'Cancelar' : 'Agregar Producto'}
                    icon={showAddProductForm ? 'pi pi-times' : 'pi pi-plus'}
                    onClick={handleAddProductClick}
                    className={showAddProductForm ? 'cancel-product-button' : 'add-product-button'}
                />
            )}
            {showAddProductForm && (
                <AddProductForm
                    newProduct={newProduct}
                    categoryOptions={categories.map((cat) => ({ label: cat.nombre, value: cat.id_categoria }))}
                    handleInputChange={(e) => {
                        const { name, value } = e.target;
                        setNewProduct((prev) => ({ ...prev, [name]: value }));
                    }}
                    handleCategoryChange={(e) => {
                        setNewProduct((prev) => ({ ...prev, id_categoria: e.value }));
                    }}
                    handleStatusChange={handleStatusChange}
                    handleAddOrEditProduct={handleAddOrEditProduct}
                    isEditing={isEditing}
                />
            )}
            {showProductTable ? (
                <ProductTable
                    products={products}
                    categories={categories}
                    rows={rows}
                    first={first}
                    onPageChange={handlePageChange}
                    handleEdit={handleEditProduct}
                    handleDelete={async (id) => {
                        try {
                            await ProductService.deleteProduct(id);
                            productToast.current.show({
                                severity: 'success',
                                summary: 'Producto Eliminado',
                                detail: 'El producto fue eliminado con éxito.',
                            });
                            fetchProducts();
                        } catch {
                            productToast.current.show({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'No se pudo eliminar el producto.',
                            });
                        }
                    }}
                />
            ) : (
                <CategoryManager />
            )}
        </div>
    );
};

export default Productos;
