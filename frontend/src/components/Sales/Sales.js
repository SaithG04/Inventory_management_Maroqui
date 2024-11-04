// src/components/Sales/Sales.js
import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
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
  const [sales, setSales] = useState([]);

  // Estado para manejar búsqueda y productos filtrados
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Estado para almacenar el producto seleccionado y su cantidad
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');

  // Estado para manejar los datos del cliente
  const [clientName, setClientName] = useState('');

  // Referencia para el Toast de notificaciones
  const toast = useRef(null);

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

  // Manejar la cantidad ingresada
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Validar la venta antes de procesarla
  const isValidSale = () => {
    if (!selectedProduct) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un producto.', life: 3000 });
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

    if (window.confirm('¿Está seguro de que desea registrar la venta?')) {
      toast.current.show({ severity: 'success', summary: 'Venta Registrada', detail: `Venta registrada para el cliente: ${clientName}`, life: 5000 });
      setClientName(''); // Limpiar el nombre del cliente
      setSales([]); // Limpiar las ventas realizadas
    }
  };

  // Eliminar un producto de la lista de ventas
  const handleDeleteSale = (id) => {
    const saleToDelete = sales.find(sale => sale.id === id);
    if (saleToDelete) {
      setProducts(products.map(p => p.name === saleToDelete.product ? { ...p, stock: p.stock + saleToDelete.quantity } : p));
    }
    const updatedSales = sales.filter(sale => sale.id !== id);
    setSales(updatedSales);
    toast.current.show({ severity: 'info', summary: 'Eliminado', detail: 'Producto eliminado de la venta.', life: 3000 });
  };

  return (
    <div className="sales-container">
      <Toast ref={toast} />
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

        <Button label="Agregar Producto" icon="pi pi-check" onClick={handleAddSale} className="btn-primary" />
      </div>

      <Button label="Registrar Venta" icon="pi pi-save" onClick={handleRegisterSale} className="btn-success" disabled={sales.length === 0} />

      {/* Lista de ventas realizadas */}
      <DataTable value={sales} paginator rows={5} className="sales-table" responsiveLayout="scroll">
        <Column field="product" header="Producto" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} />
        <Column field="quantity" header="Cantidad" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} />
        <Column field="price" header="Precio Unitario (S/)" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} />
        <Column field="total" header="Total (S/)" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center' }} />
        <Column
          header="Acciones"
          body={(rowData) => (
            <div className="sales-button-container">
              <Button
                icon="pi pi-pencil"
                className="btn-primary"
                onClick={() => {}}
                tooltip="Editar"
              />
              <Button
                icon="pi pi-trash"
                className="btn-delete"
                onClick={() => handleDeleteSale(rowData.id)}
                tooltip="Eliminar"
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
