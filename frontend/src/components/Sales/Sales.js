// src/components/Sales/Sales.js
import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import './Sales.css';

const Sales = () => {
  // Productos disponibles para la venta (datos estáticos de ejemplo)
  const [products, setProducts] = useState([
    { id: 1, name: 'Cuaderno', price: 5.50, stock: 100 },
    { id: 2, name: 'Lápiz', price: 1.20, stock: 200 },
    { id: 3, name: 'Borrador', price: 0.80, stock: 150 },
    { id: 4, name: 'Regla', price: 2.00, stock: 80 },
    { id: 5, name: 'Calculadora', price: 10.00, stock: 50 }
  ]);

  // Estado para almacenar las ventas realizadas
  const [sales, setSales] = useState(() => {
    const savedSales = localStorage.getItem('sales');
    return savedSales ? JSON.parse(savedSales) : [];
  });
  const [editingSale, setEditingSale] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estado para manejar búsqueda y productos filtrados
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Estado para almacenar el producto seleccionado y su cantidad
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');

  // Estado para manejar los datos del cliente
  const [clientName, setClientName] = useState(() => {
    return localStorage.getItem('clientName') || '';
  });

  // Referencia para el Toast de notificaciones
  const toast = useRef(null);

  // Estado para habilitar/deshabilitar el botón de cancelar venta
  const [isCancelDisabled, setIsCancelDisabled] = useState(true);

  useEffect(() => {
    // Habilitar o deshabilitar el botón de cancelar venta basado en los datos ingresados
    if (clientName.trim() || sales.length > 0 || searchTerm.trim() || quantity) {
      setIsCancelDisabled(false);
    } else {
      setIsCancelDisabled(true);
    }
  }, [clientName, sales, searchTerm, quantity]);

  useEffect(() => {
    // Guardar las ventas y el nombre del cliente en localStorage
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('clientName', clientName);
  }, [sales, clientName]);

  // Manejar cambios en el término de búsqueda
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Solo buscar si el término no está vacío
    if (term.trim() !== '') {
      // Filtrar productos basados en el término de búsqueda
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.id.toString().includes(term)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]); // Si está vacío, no mostrar nada
    }
  };

  // Manejar la selección del producto
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name); // Rellenar el campo de búsqueda con el nombre del producto
    setFilteredProducts([]); // Ocultar la lista después de seleccionar
  };

  const handleEditSale = (sale) => {
    confirmDialog({
      message: '¿Está seguro de que desea editar este producto?',
      header: 'Confirmación de Edición',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'custom-accept-button',
      rejectClassName: 'custom-reject-button',
      accept: () => {
        setEditingSale(sale);
        setSelectedProduct(products.find((product) => product.name === sale.product));
        setQuantity(sale.quantity);
        setSearchTerm(sale.product);
        setIsEditing(true);
      },
    });
  };

  // Manejar la cantidad ingresada
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Validar la venta antes de procesarla
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
    if (sales.some(sale => sale.product === selectedProduct.name)) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'El producto ya está agregado a la venta. Puede editarlo desde la lista.', life: 3000 });
      return false;
    }
    return true;
  };

  // Calcular el total de la venta (cantidad * precio del producto)
  const calculateTotal = (product, quantity) => {
    return (product.price * quantity).toFixed(2);
  };

  // Procesar la venta
  const handleAddSale = () => {
    if (!isValidSale()) return;

    const newSale = {
      id: sales.length + 1,
      product: selectedProduct.name,
      price: selectedProduct.price,
      quantity: parseInt(quantity),
      total: calculateTotal(selectedProduct, quantity),
    };

    setSales([...sales, newSale]);
    setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, stock: p.stock - newSale.quantity } : p));
    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto agregado a la venta.', life: 3000 });
    setQuantity(''); // Limpiar la cantidad
    setSelectedProduct(null); // Limpiar la selección de producto
    setSearchTerm(''); // Limpiar el término de búsqueda
  };

  // Guardar la edición de una venta
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

    setSales(updatedSales);
    setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, stock: p.stock - (parseInt(quantity) - editingSale.quantity) } : p));
    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto editado con éxito.', life: 3000 });

    // Limpiar estado después de editar
    setQuantity('');
    setSelectedProduct(null);
    setSearchTerm('');
    setEditingSale(null);
    setIsEditing(false);
  };

  // Manejar el cambio en el nombre del cliente
  const handleClientNameChange = (e) => {
    setClientName(e.target.value);
  };

  // Registrar la venta completa
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
      acceptClassName: 'custom-accept-button',
      rejectClassName: 'custom-reject-button',
      accept: () => {
        toast.current.show({
          severity: 'success',
          summary: 'Venta Registrada',
          detail: `Venta registrada para el cliente: ${clientName}`,
          life: 5000,
        });
        setClientName('');
        setSales([]);
      },
    });
  };

  // Cancelar la venta y limpiar todos los datos
  const handleCancelSale = () => {
    confirmDialog({
      message: '¿Está seguro de que desea cancelar la venta?',
      header: 'Confirmación de Cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'custom-accept-button',
      rejectClassName: 'custom-reject-button',
      accept: () => {
        setClientName('');
        setSales([]);
        setQuantity('');
        setSelectedProduct(null);
        setSearchTerm('');
        toast.current.show({ severity: 'info', summary: 'Venta Cancelada', detail: 'La venta ha sido cancelada.', life: 3000 });
      },
    });
  };

  // Eliminar un producto de la lista de ventas
  const handleDeleteSale = (id) => {
    confirmDialog({
      message: '¿Está seguro de que desea eliminar este producto de la lista de ventas?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'custom-accept-button',
      rejectClassName: 'custom-reject-button',
      accept: () => {
        const saleToDelete = sales.find((sale) => sale.id === id);
        if (saleToDelete) {
          setProducts(
            products.map((p) =>
              p.name === saleToDelete.product ? { ...p, stock: p.stock + saleToDelete.quantity } : p
            )
          );
        }
        const updatedSales = sales.filter((sale) => sale.id !== id);
        setSales(updatedSales);
        toast.current.show({
          severity: 'info',
          summary: 'Eliminado',
          detail: 'Producto eliminado de la venta.',
          life: 3000,
        });
      },
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
            onChange={handleClientNameChange}
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
          {/* Mostrar lista de productos filtrados solo si hay un término de búsqueda */}
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
