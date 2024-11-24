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
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [showProductTable, setShowProductTable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [toastShown, setToastShown] = useState(false);
    const [error, setError] = useState(null);
    const [newProduct, setNewProduct] = useState({
        id_producto: '',
        nombre: '',
        precio: '',
        stock: '',
        id_categoria: '',
        unidad_medida: '',
        estado: 'Activo', // Valor por defecto alineado con el dropdown
        descripcion: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(15);

    // Función para cargar productos
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        setToastShown(false);
        try {
            const productList = await ProductService.listProducts();
            setProducts(productList || []);
        } catch (err) {
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para cargar categorías
    const fetchCategories = useCallback(async () => {
        try {
            const categoryList = await CategoryService.listCategories();
            setCategories(categoryList || []);
        } catch (err) {
            productToast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar las categorías.',
            });
        }
    }, []);

    // Mostrar Toast solo una vez cuando la carga se complete
    useEffect(() => {
        if (!loading && !toastShown && showProductTable) {
            if (error) {
                productToast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                });
            } else if (products.length > 0) {
                productToast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Productos cargados correctamente.',
                });
            }
            setToastShown(true);
        }
    }, [loading, error, toastShown, showProductTable, products]);

    // Efecto para cargar productos y categorías solo si se visualizan
    useEffect(() => {
        if (showProductTable) {
            fetchProducts();
            fetchCategories();
        }
    }, [showProductTable, fetchProducts, fetchCategories]);

    // Cambio de vista entre productos y categorías
    const handleViewChange = (view) => {
        setShowProductTable(view === 'products');
        setShowAddProductForm(false);
        setToastShown(false);
    };

    // Gestión de formulario de productos
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

    // Guardar o editar productos
    const handleAddOrEditProduct = async () => {
        try {
            if (isEditing) {
                await ProductService.updateProduct(newProduct.id_producto, newProduct);
                productToast.current.show({
                    severity: 'success',
                    summary: 'Producto Actualizado',
                    detail: 'El producto fue actualizado con éxito.',
                });
            } else {
                await ProductService.saveProduct(newProduct);
                productToast.current.show({
                    severity: 'success',
                    summary: 'Producto Agregado',
                    detail: 'El producto fue agregado con éxito.',
                });
            }
            fetchProducts();
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

    // Definir handleStatusChange para manejar el cambio de estado del producto
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
                ] : []}
                searchCriteria={searchCriteria}
                setSearchCriteria={setSearchCriteria}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isAvailable={isAvailable}
                setIsAvailable={setIsAvailable}
                setFilteredProducts={setProducts}
                products={products}
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
                    handleStatusChange={handleStatusChange} // Pasa la función handleStatusChange
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
                        } catch (error) {
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
