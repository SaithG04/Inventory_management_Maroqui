// src/components/Inventory/Inventory.js
import React, { useState, useEffect } from 'react';
import './Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Cuaderno', code: 'CU001', category: 'Papelería', price: 5.50, stock: 100 },
    { id: 2, name: 'Lápiz', code: 'LP001', category: 'Papelería', price: 1.20, stock: 200 },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    category: '',
    price: '',
    stock: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [error, setError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Función para manejar los cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Validar producto
  const isValidProduct = () => {
    const { name, code, category, price, stock } = newProduct;
    if (!name || !code || !category || !price || !stock) {
      showMessage('error', 'Por favor, complete todos los campos.');
      return false;
    }
    if (isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
      showMessage('error', 'Ingrese valores numéricos válidos para el precio y el stock.');
      return false;
    }
    return true;
  };

  // Mostrar mensajes de error o éxito con temporizador
  const showMessage = (type, message) => {
    if (type === 'error') {
      setError(message);
    } else {
      setFeedbackMessage(message);
    }

    // Desaparecer el mensaje después de 5 segundos
    setTimeout(() => {
      setError('');
      setFeedbackMessage('');
    }, 5000); // 5 segundos
  };

  // Agregar o actualizar un producto
  const handleAddOrEditProduct = () => {
    if (!isValidProduct()) return;

    if (isEditing) {
      setProducts(products.map(product =>
        product.id === editProductId ? { ...product, ...newProduct } : product
      ));
      setIsEditing(false);
      setEditProductId(null);
      showMessage('success', 'Producto actualizado con éxito.');
    } else {
      const newProductEntry = {
        ...newProduct,
        id: products.length + 1,
      };
      setProducts([...products, newProductEntry]);
      showMessage('success', 'Producto agregado con éxito.');
    }
    handleClearForm();
  };

  // Iniciar el modo de edición
  const handleEditProduct = (product) => {
    setNewProduct(product);
    setIsEditing(true);
    setEditProductId(product.id);
    setFeedbackMessage('');
  };

  // Eliminar un producto
  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    showMessage('success', 'Producto eliminado con éxito.');
  };

  // Limpiar el formulario
  const handleClearForm = () => {
    setNewProduct({ name: '', code: '', category: '', price: '', stock: '' });
    setIsEditing(false);
    setEditProductId(null);
    setFeedbackMessage('');
  };

  // Filtrar productos según el término de búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory-container">
      <h2>Gestión de Inventario</h2>

      {/* Campo de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Formulario para agregar o editar producto */}
      <div className="add-product-form">
        <h3>{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>

        {/* Mensajes de error y éxito */}
        {error && <p className="error-message">{error}</p>}
        {feedbackMessage && <p className="success-message">{feedbackMessage}</p>}

        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={newProduct.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="code"
          placeholder="Código del producto"
          value={newProduct.code}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={newProduct.category}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={newProduct.price}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Cantidad en stock"
          value={newProduct.stock}
          onChange={handleInputChange}
        />
        <div className="form-buttons">
          <button onClick={handleAddOrEditProduct}>
            {isEditing ? 'Guardar Cambios' : 'Agregar Producto'}
          </button>
          <button onClick={handleClearForm} className="clear-button">Limpiar</button>
        </div>
      </div>

      {/* Lista de productos */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.code}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => handleEditProduct(product)}>Editar</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
