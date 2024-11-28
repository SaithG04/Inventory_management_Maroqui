import React, { useState, useEffect, useRef, useCallback } from 'react';
import SearchSection from './components/search-section/SearchSection';
import AddProductForm from './components/add-product-form/AddProductForm';
import ProductTable from './components/product-table/ProductTable';
import CategoryManager from './components/category-manager/CategoryManager';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import ProductService from '../../services/products/ProductService';
import Modal from '../../../src/components/shared/modal/Modal'; // Ajusta la ruta según dónde esté tu componente Modal
import CategoryService from '../../services/products/CategoryService';
import './Productos.css';

const Productos = ({ userRole }) => {
    const productToast = useRef(null);

    // Estados principales
    const [originalProducts, setOriginalProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]); // Esto es lo correcto
    const [searchCriteria, setSearchCriteria] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [showProductTable, setShowProductTable] = useState(true); // Controla si se muestra la tabla de productos o categorías
    const [loading, setLoading] = useState(false);
    const [isToastShown, setIsToastShown] = useState(false);
    const [newProduct, setNewProduct] = useState({
        id_producto: '',
        nombre: '',
        unidad_medida: '',
        descripcion: '',
        stock: '0',
        id_categoria: '',
        estado: 'ACTIVE',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(15);
    const [showCancelModal, setShowCancelModal] = useState(false); // Estado para mostrar el modal de confirmación

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
            setIsToastShown(true);
        }
    }, [loading, products, isToastShown]);

    useEffect(() => {
        if (originalProducts.length > 0 && categories.length > 0) {
            const enrichedProducts = enrichProductsWithCategory(originalProducts, categories);
            setProducts(enrichedProducts);
        }
    }, [originalProducts, categories]);


    useEffect(() => {
        if (showProductTable) {
            // Solo carga las categorías y productos si no están ya cargados
            if (!categories.length) fetchCategories();
            if (!originalProducts.length) fetchProducts();
        }
    }, [showProductTable, categories, originalProducts, fetchCategories, fetchProducts]);


    const enrichProductsWithCategory = (products, categories) => {
        return products.map((product) => {
            const category = categories.find((cat) => cat.id_categoria === product.id_categoria);
            return {
                ...product,
                categoria_nombre: category ? category.nombre : 'Sin Categoría',
            };
        });
    };

    // Manejar el cambio de vista entre productos y categorías
    const handleViewChange = (view) => {
        setShowProductTable(view === 'products');
        setShowAddProductForm(false); // Restablecer el formulario
        setSearchTerm(''); // Limpiar el término de búsqueda
        setSearchCriteria(null); // Limpiar el criterio de búsqueda
        setIsToastShown(false); // Restablecer el Toast
    };


    const handleAddProductClick = () => {
        if (showAddProductForm) {
            // Verificar si hay datos importantes llenos en el formulario antes de cerrar
            if (
                newProduct.nombre.trim() !== '' ||
                newProduct.id_categoria !== '' ||
                newProduct.estado !== 'ACTIVE'
            ) {
                // Mostrar el modal de confirmación si hay datos
                setShowCancelModal(true);
            } else {
                // Si no hay datos, cerrar el formulario directamente
                setShowAddProductForm(false);
            }
        } else {
            // Si no está abierto, abrir el formulario
            setShowAddProductForm(true);
            resetNewProduct();
            setIsEditing(false);
        }
    };

    const handleCancelModalConfirm = () => {
        // Confirmar el cierre del formulario
        setShowAddProductForm(false);
        setShowCancelModal(false);
    };

    const handleCancelModalHide = () => {
        // Cancelar la acción de cerrar
        setShowCancelModal(false);
    };

    const resetNewProduct = () => {
        setNewProduct({
            id_producto: '',
            nombre: '',
            unidad_medida: '',
            descripcion: '',
            stock: '0',
            id_categoria: '',
            estado: 'ACTIVE',
        });
    };

    const handleAddOrEditProduct = async () => {
        const productToSave = {
            nombre: newProduct.nombre || '',
            id_categoria: newProduct.id_categoria || '',
            descripcion: newProduct.descripcion || null,
            unidad_medida: newProduct.unidad_medida || 'UN',
            stock: newProduct.stock || 0,
            estado: newProduct.estado || 'ACTIVE',
        };

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
            unidad_medida: product.unidad_medida,
            descripcion: product.descripcion,
            stock: product.stock,
            id_categoria: product.id_categoria,
            estado: product.estado,
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

            {/* Sección de búsqueda */}
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
                filteredCategories={setFilteredCategories}
                products={originalProducts}
                categories={categories}
                toast={productToast}
                showProductTable={showProductTable}
            />


            {/* Botones para cambiar entre productos y categorías */}
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

            {/* Mostrar el botón de agregar producto si estamos en la vista de productos */}
            {showProductTable && (
                <Button
                    label={showAddProductForm ? 'Cancelar' : 'Agregar Producto'}
                    icon={showAddProductForm ? 'pi pi-times' : 'pi pi-plus'}
                    onClick={handleAddProductClick}
                    className={showAddProductForm ? 'cancel-product-button' : 'add-product-button'}
                />
            )}

            {/* Modal de Confirmación para Cerrar el Formulario */}
            <Modal
                show={showCancelModal}
                onClose={handleCancelModalHide}
                onConfirm={handleCancelModalConfirm}
                title="Confirmación"
                message="¿Estás seguro de que deseas cerrar el formulario? Se perderán todos los datos no guardados."
            />

            {/* Formulario de agregar o editar producto */}
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

            {/* Mostrar la tabla de productos o el manejador de categorías */}
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
                <CategoryManager
                    categories={categories}
                    setFilteredCategories={setFilteredCategories} // Pásalo correctamente
                    searchTerm={searchTerm}
                    searchCriteria={searchCriteria}
                />

            )}
        </div>
    );
};

export default Productos;
