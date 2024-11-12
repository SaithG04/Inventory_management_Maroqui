import React, { createContext, useState, useEffect } from 'react';
import { productApiAdapter } from '../components/Producto/productApiAdapter'; // Asumiendo que tienes un adaptador de API
import { productService } from '../components/Producto/productService'; // Usamos el servicio para gestionar productos

// Creamos el contexto
export const ProductContext = createContext();

// Componente que envuelve toda la aplicación o partes que necesiten acceder al contexto
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);  // Estado para almacenar productos
  const [categoryOptions, setCategoryOptions] = useState([]);  // Opciones de categorías
  const [loading, setLoading] = useState(false);  // Estado para indicar si la carga está en progreso

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Llamamos al adaptador para obtener los productos desde el backend
        const fetchedProducts = await productApiAdapter.fetchAllProducts();
        setProducts(fetchedProducts);
        
        // Llamamos a otro adaptador si es necesario para obtener categorías
        const fetchedCategories = await productApiAdapter.fetchCategories();
        setCategoryOptions(fetchedCategories);
      } catch (error) {
        console.error("Error al cargar productos y categorías", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);  // Solo se ejecuta una vez al cargar el componente

  // Función para agregar un producto
  const addProduct = async (product) => {
    try {
      const newProduct = await productService.addProduct(product);
      setProducts(prevProducts => [...prevProducts, newProduct]);
    } catch (error) {
      console.error("Error al agregar producto", error);
    }
  };

  // Función para actualizar el stock de un producto
  const updateProductStock = (id, stock) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, stock } : product
    );
    setProducts(updatedProducts);
  };

  // Función para eliminar un producto
  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
  };

  // Función para agregar una categoría
  const addCategory = (category) => {
    setCategoryOptions(prevCategories => [...prevCategories, category]);
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProductStock,
      deleteProduct,
      categoryOptions,
      addCategory,
      loading
    }}>
      {children}
    </ProductContext.Provider>
  );
};
