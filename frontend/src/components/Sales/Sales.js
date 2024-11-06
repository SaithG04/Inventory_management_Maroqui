// src/components/Sales/Sales.js
import React, { useState, useRef, useEffect, useContext } from 'react';
import { ProductContext } from '../../context/ProductContext'; // Importar el contexto
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import './Sales.css';

const Sales = () => {
    const { products, updateProductStock } = useContext(ProductContext); // Usar el contexto
    const [sales, setSales] = useState(() => {
        const savedSales = localStorage.getItem('sales');
        return savedSales ? JSON.parse(savedSales) : [];
    });
    const [editingSale, setEditingSale] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [clientName, setClientName] = useState(() => {
        return localStorage.getItem('clientName') || '';
    });
    const toast = useRef(null);
    const [isCancelDisabled, setIsCancelDisabled] = useState(true);

    useEffect(() => {
        if (clientName.trim() || sales.length > 0 || searchTerm.trim() || quantity) {
            setIsCancelDisabled(false);
        } else {
            setIsCancelDisabled(true);
        }
    }, [clientName, sales, searchTerm, quantity]);

    useEffect(() => {
        localStorage.setItem('sales', JSON.stringify(sales));
        localStorage.setItem('clientName', clientName);
    }, [sales, clientName]);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim() !== '') {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(term.toLowerCase()) ||
                product.id.toString().includes(term)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setSearchTerm(product.name);
        setFilteredProducts([]);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const isValidSale = () => {
        if (!clientName.trim()) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Debe ingresar el nombre del cliente.', life: 3000 });
            return false;
        }
        if (!selectedProduct) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un producto.', life: 3000 });
            return false;
        }
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe ingresar una cantidad válida.', life: 3000 });
            return false;
        }
        if (quantity > selectedProduct.stock) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La cantidad solicitada supera el stock disponible.', life: 3000 });
            return false;
        }
        // Aquí chequeamos si estamos editando, permitiendo el producto en la lista
        if (!isEditing && sales.some(sale => sale.product === selectedProduct.name)) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El producto ya está agregado a la venta. Puede editarlo desde la lista.', life: 3000 });
            return false;
        }
        return true;
    };
    

    const calculateTotal = (product, quantity) => {
        return (product.price * quantity).toFixed(2);
    };

    // Actualiza el stock en función de la cantidad
    const handleAddSale = () => {
        if (!isValidSale()) return;
    
        const newSale = {
            id: sales.length + 1,
            product: selectedProduct.name,
            price: selectedProduct.price,
            quantity: parseInt(quantity),
            total: calculateTotal(selectedProduct, quantity),
            date: new Date().toISOString()  // Agrega la fecha en formato ISO
        };
    
        // Actualiza el stock en productos
        updateProductStock(selectedProduct.id, selectedProduct.stock - newSale.quantity);
    
        const updatedSales = [...sales, newSale];
        setSales(updatedSales);
        
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto agregado a la venta.', life: 3000 });
    
        // Limpiar los campos después de agregar el producto
        setQuantity('');
        setSelectedProduct(null);
        setSearchTerm(''); // Limpia la caja de texto de búsqueda
    };
    const handleSaveEdit = () => {
        if (!isValidSale()) return;

        const updatedSales = sales.map(sale =>
            sale.id === editingSale.id
                ? {
                    ...sale,
                    product: selectedProduct.name,
                    price: selectedProduct.price,
                    quantity: parseInt(quantity),
                    total: calculateTotal(selectedProduct, quantity),
                }
                : sale
        );
    
         // Actualiza el stock correctamente para reflejar la cantidad editada
         updateProductStock(selectedProduct.id, selectedProduct.stock + editingSale.quantity - parseInt(quantity));

         setSales(updatedSales);
         toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto editado con éxito.', life: 3000 });
 
         // Limpiar estado después de editar
         setQuantity('');
         setSelectedProduct(null);
         setEditingSale(null);
         setIsEditing(false);
     };
    

     const handleDeleteSale = (id) => {
        confirmDialog({
            message: '¿Está seguro de que desea eliminar este producto de la lista de ventas?',
            header: 'Confirmación de Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'custom-accept-button', // Clase personalizada
            rejectClassName: 'custom-reject-button', // Clase personalizada
            accept: () => {
                const saleToDelete = sales.find((sale) => sale.id === id);
                if (saleToDelete) {
                    const productToRestore = products.find(p => p.name === saleToDelete.product);
                    if (productToRestore) {
                        updateProductStock(productToRestore.id, productToRestore.stock + saleToDelete.quantity); // Restaurar stock
                    }
                }
                const updatedSales = sales.filter((sale) => sale.id !== id);
                setSales(updatedSales);
                toast.current.show({
                    severity: 'info',
                    summary: 'Eliminado',
                    detail: 'Producto eliminado de la venta.',
                    life: 3000,
                });
            }
        });
    };

    const handleRegisterSale = () => {
        if (!clientName.trim()) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe ingresar el nombre del cliente.', life: 3000 });
            return;
        }

        if (sales.length === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe agregar al menos un producto antes de registrar la venta.', life: 3000 });
            return;
        }

        confirmDialog({
            message: '¿Está seguro de que desea registrar la venta?',
            header: 'Confirmación de Registro',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'custom-accept-button', // Clase personalizada
            rejectClassName: 'custom-reject-button', // Clase personalizada
            accept: () => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Venta Registrada',
                    detail: `Venta registrada para el cliente: ${clientName}`,
                    life: 5000,
                });
                setClientName('');
                setSales([]);
            }
        });
    };

    const handleCancelSale = () => {
        confirmDialog({
            message: '¿Está seguro de que desea cancelar la venta?',
            header: 'Confirmación de Cancelación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'custom-accept-button',
            rejectClassName: 'custom-reject-button',
            accept: () => {
                // Restaurar el stock de cada producto en la venta
                sales.forEach(sale => {
                    const product = products.find(p => p.name === sale.product);
                    if (product) {
                        updateProductStock(product.id, product.stock + sale.quantity);
                    }
                });
                
                // Limpiar estado después de cancelar la venta
                setClientName('');
                setSales([]);
                setQuantity('');
                setSelectedProduct(null);
                toast.current.show({ severity: 'info', summary: 'Venta Cancelada', detail: 'La venta ha sido cancelada.', life: 3000 });
            },
        });
    };
    

    const handleEditSale = (sale) => {
        confirmDialog({
            message: '¿Está seguro de que desea editar este producto?',
            header: 'Confirmación de Edición',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'custom-accept-button', // Clase personalizada
            rejectClassName: 'custom-reject-button', // Clase personalizada
            accept: () => {
                setEditingSale(sale);
                setSelectedProduct(products.find((product) => product.name === sale.product));
                setQuantity(sale.quantity);
                setSearchTerm(sale.product);
                setIsEditing(true);
            }
        });
    };

    return (
        <div className="sales-container">
            <Toast ref={toast} />
            <ConfirmDialog />
            <h2>Gestión de Ventas</h2>

            {/* Formulario para los datos del cliente */}
            <div className="client-form">
                <h3>Datos del Cliente</h3>
                <div className="form-group">
                    <label>Nombre del Cliente / Colegio / Empresa</label>
                    <input
                        type="text"
                        placeholder="Nombre del cliente..."
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="client-input"
                    />
                </div>
            </div>

            {/* Formulario para realizar la venta */}
            <div className="sales-form">
                <h3>Registrar Nueva Venta</h3>

                <div className="form-group">
                    <label>Buscar Producto</label>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    {searchTerm.trim() !== '' && filteredProducts.length > 0 && (
                        <ul className="product-list">
                            {filteredProducts.map(product => (
                                <li
                                    key={product.id}
                                    onClick={() => handleProductSelect(product)}
                                    className="product-item"
                                >
                                    {product.name} - S/{product.price} (Stock: {product.stock})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="form-group">
                    <label>Cantidad</label>
                    <input
                        type="number"
                        placeholder="Cantidad"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="quantity-input"
                    />
                </div>

                <Button
                    label={isEditing ? "Guardar Cambios" : "Agregar Producto"}
                    icon="pi pi-check"
                    onClick={isEditing ? handleSaveEdit : handleAddSale}
                    className="btn-primary"
                />
                <Button
                    label="Cancelar Venta"
                    icon="pi pi-times"
                    onClick={handleCancelSale}
                    className="btn-delete"
                    style={{ marginLeft: '10px' }}
                    disabled={isCancelDisabled}
                />
            </div>

            <Button label="Registrar Venta" icon="pi pi-save" onClick={handleRegisterSale} className="btn-success" disabled={sales.length === 0} />

            {/* Lista de ventas realizadas */}
            <DataTable value={sales} paginator rows={5} className="sales-table" responsiveLayout="scroll">
                <Column field="product" header="Producto" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} />
                <Column field="quantity" header="Cantidad" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} />
                <Column field="price" header="Precio Unitario (S/)" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} />
                <Column field="total" header="Total (S/)" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} />
                <Column
                    body={(rowData) => (
                        <div className="sales-button-container">
                            <Button
                                icon="pi pi-pencil"
                                label="Editar"
                                className="btn-primary"
                                onClick={() => handleEditSale(rowData)}
                            />
                            <Button
                                icon="pi pi-trash"
                                label="Eliminar"
                                className="btn-delete"
                                onClick={() => handleDeleteSale(rowData.id)}
                            />
                        </div>
                    )}
                    headerStyle={{ textAlign: 'center' }}
                    bodyStyle={{ textAlign: 'center' }}
                />
            </DataTable>
        </div>
    );
};

export default Sales;
