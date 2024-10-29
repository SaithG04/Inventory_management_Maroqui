// src/components/Sales/Sales.js
import React, { useState } from 'react';
import './Sales.css';

const Sales = () => {
  // Productos disponibles para la venta (datos estáticos de ejemplo)
  const [products] = useState([
    { id: 1, name: 'Cuaderno', price: 5.50 },
    { id: 2, name: 'Lápiz', price: 1.20 },
    { id: 3, name: 'Borrador', price: 0.80 },
    { id: 4, name: 'Regla', price: 2.00 },
    { id: 5, name: 'Calculadora', price: 10.00 }
  ]);

  // Estado para almacenar las ventas realizadas
  const [sales, setSales] = useState([]);

  // Estado para manejar búsqueda y productos filtrados
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Estado para almacenar el producto seleccionado y su cantidad
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');

  // Estado para manejar mensajes de éxito o error
  const [error, setError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

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
      setError('Debe seleccionar un producto.');
      return false;
    }
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      setError('Debe ingresar una cantidad válida.');
      return false;
    }
    setError(''); // Limpiar errores
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
    setFeedbackMessage('Producto agregado a la venta.');
    setQuantity(''); // Limpiar la cantidad
    setSelectedProduct(null); // Limpiar la selección de producto
    setSearchTerm(''); // Limpiar el término de búsqueda

    // Limpiar mensaje de éxito después de 5 segundos
    setTimeout(() => {
      setFeedbackMessage('');
    }, 5000);
  };

  // Eliminar un producto de la lista de ventas
  const handleDeleteSale = (id) => {
    const updatedSales = sales.filter(sale => sale.id !== id);
    setSales(updatedSales);
    setFeedbackMessage('Producto eliminado de la venta.');
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      setFeedbackMessage('');
    }, 5000);
  };

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h2>Gestión de Ventas</h2>
      </div>

      {/* Formulario para realizar la venta */}
      <div className="sales-form">
        <h3>Registrar Nueva Venta</h3>

        {/* Mensajes de error y éxito */}
        {error && <p className="error-message">{error}</p>}
        {feedbackMessage && <p className="success-message">{feedbackMessage}</p>}

        <div className="form-group">
          <label>Buscar Producto</label>
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={handleSearchChange}
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
                  {product.name} - ${product.price}
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
          />
        </div>

        <button onClick={handleAddSale} className="btn-primary">Agregar Producto</button>
      </div>

      {/* Lista de ventas realizadas */}
      <table className="sales-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id}>
              <td>{sale.product}</td>
              <td>{sale.quantity}</td>
              <td>${sale.price}</td>
              <td>${sale.total}</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteSale(sale.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
