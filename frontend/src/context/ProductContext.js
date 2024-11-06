// src/context/ProductContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([
        { name: 'Juegos y Actividades', code: 'juegos' },
        { name: 'Materiales de Oficina', code: 'oficina' },
        { name: 'Arte y Dibujo', code: 'arteydibujo' },
        { name: 'Escribir y Corregir', code: 'escribirycorregir' },
        { name: 'Organización y Gestión', code: 'organygest' },
        { name: 'Accesorios y Mochilas', code: 'accesorios' }
    ]);

    // Cargar los productos al inicio (desde localStorage o datos iniciales)
    useEffect(() => {
        let savedProducts = JSON.parse(localStorage.getItem('products'));
        if (!savedProducts || savedProducts.length === 0) {
            savedProducts = [
                { id: 1, name: 'Cuaderno', price: 5.50, stock: 100, category: 'Organización y Gestión', unit: 'Unidad', status: 'Activo', description: 'Cuaderno tamaño A4' },
                { id: 2, name: 'Lápiz', price: 1.20, stock: 200, category: 'Escribir y Corregir', unit: 'Pieza', status: 'Activo', description: 'Lápiz HB' },
                { id: 3, name: 'Borrador', price: 0.80, stock: 150, category: 'Escribir y Corregir', unit: 'Pieza', status: 'Activo', description: 'Borrador blanco' },
                { id: 4, name: 'Regla', price: 2.00, stock: 80, category: 'Escribir y Corregir', unit: 'Pieza', status: 'Activo', description: 'Regla de 30 cm' },
                { id: 5, name: 'Calculadora', price: 10.00, stock: 50, category: 'Materiales de Oficina', unit: 'Unidad', status: 'Activo', description: 'Calculadora científica' }
            ];
        }
        setProducts(savedProducts);
    }, []);
    

    // Guardar productos en localStorage cada vez que cambian
    useEffect(() => {
        try {
            // Guardar todos los campos del producto en localStorage
            localStorage.setItem('products', JSON.stringify(products));
        } catch (error) {
            console.error("Error al guardar en localStorage:", error);
        }
    }, [products]);
    
    

    // Función para agregar un producto
    const addProduct = (newProduct) => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
    };

    // Función para actualizar el stock de un producto específico
    const updateProductStock = (id, newStock) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === id ? { ...product, stock: newStock } : product
            )
        );
    };

    // Función para eliminar un producto
    const deleteProduct = (id) => {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    };

    // Función para agregar una categoría
    const addCategory = (newCategory) => {
        setCategoryOptions(prevCategories => [...prevCategories, newCategory]);
    };

    return (
        <ProductContext.Provider value={{ products, categoryOptions, addProduct, updateProductStock, deleteProduct, addCategory }}>
            {children}
        </ProductContext.Provider>
    );
};
