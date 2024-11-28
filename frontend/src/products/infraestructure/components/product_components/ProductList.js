import React, { useEffect, useState } from "react";
import ProductService from "../../../domain/services/ProductService";
import { ProductDTO } from "../../dto/ProductDTO";

const ProductList = ({ onEditProduct, refreshTrigger, products }) => {
  const [allProducts, setAllProducts] = useState([]);
  const productService = new ProductService();

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      const fetchedProducts = response?.data || []; // Si data es null/undefined, usar un array vacío
      console.log(fetchedProducts);
  
      // Verificar si no hay productos
      if (fetchedProducts.length === 0) {
        console.log('No products found');
        setAllProducts([]);  // Setear la lista de productos vacía
        return;  // Terminar la ejecución si no hay productos
      }
  
      // Validación y conversión de productos
      const validProducts = fetchedProducts
        .map((productData) => {
          // Validación del producto
          if (
            !productData.product_id ||
            !productData.name ||
            !productData.status ||
            typeof productData.product_id !== 'number' ||
            typeof productData.name !== 'string' || productData.name.trim() === '' ||
            !['ACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK'].includes(productData.status)
          ) {
            console.error('Invalid product data:', productData);
            return null; // Ignorar producto con datos inválidos
          }
  
          // Conversión usando ProductDTO
          try {
            const productDTO = new ProductDTO(productData);
            return productDTO.toDomain(); // Convertir a dominio
          } catch (err) {
            console.error('Error converting product to domain:', productData, err);
            return null; // Ignorar producto que no se puede convertir
          }
        })
        .filter((product) => product !== null); // Filtrar productos inválidos
  
      setAllProducts(validProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]); // Setear lista vacía en caso de error
    }
  };

  const onDeleteProduct = async (productId) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete this product?");
      if (isConfirmed) {
        await productService.deleteProduct(productId);
        fetchProducts();
        
        alert("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product.");
    }
  };


  // Actualiza la lista cuando el componente se monta o refreshTrigger cambia
  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]); // Agregar refreshTrigger como dependencia

  const displayProducts = products.length > 0 ? products : allProducts;

  return (
    <div>
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Description</th>
            <th>Unit Measurement</th>
            <th>Stock</th>
            <th>Category ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <tr key={product.product_id}>
                <td>{product.name}</td>  
                <td>{product.code}</td>
                <td>{product.description}</td>
                <td>{product.unit_measurement}</td>
                <td>{product.stock}</td>
                <td>{product.category_id}</td>
                <td>{product.status}</td>
                <td>
                  <button onClick={() => onEditProduct(product.product_id)}>
                    Edit
                  </button>
                  <button onClick={() => onDeleteProduct(product.product_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No products available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
