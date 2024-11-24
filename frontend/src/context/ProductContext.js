import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const ProductContext = createContext();

// Componente proveedor que envolverá el árbol de componentes
export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    // Función para cargar datos desde el almacenamiento local o backend
    const loadFromLocalStorage = (key, fallback) => {
        try {
            const savedData = JSON.parse(localStorage.getItem(key));
            return savedData && savedData.length > 0 ? savedData : fallback;
        } catch (error) {
            console.error(`Error al cargar ${key} desde localStorage:`, error);
            return fallback;
        }
    };

    const saveToLocalStorage = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error al guardar ${key} en localStorage:`, error);
        }
    };

    // Cargar productos y categorías al iniciar
    useEffect(() => {
        const initialProducts = [
            { id: 1, name: 'Cuaderno', price: 5.50, stock: 100, category: 'Organización y Gestión', unit: 'Unidad', status: 'Activo', description: 'Cuaderno tamaño A4' },
            { id: 2, name: 'Lápiz', price: 1.20, stock: 200, category: 'Escribir y Corregir', unit: 'Pieza', status: 'Activo', description: 'Lápiz HB' },
            { id: 3, name: 'Borrador', price: 0.80, stock: 150, category: 'Escribir y Corregir', unit: 'Pieza', status: 'Activo', description: 'Borrador blanco' },
            { id: 4, name: 'Regla', price: 2.00, stock: 0, category: 'Escribir y Corregir', unit: 'Pieza', status: 'Sin stock', description: 'Regla de 30 cm' },
            { id: 5, name: 'Calculadora', price: 10.00, stock: 50, category: 'Materiales de Oficina', unit: 'Unidad', status: 'Activo', description: 'Calculadora científica' },
        ];

        const initialCategories = [
            { name: 'Juegos y Actividades', code: 'juegos' },
            { name: 'Materiales de Oficina', code: 'oficina' },
            { name: 'Arte y Dibujo', code: 'arteydibujo' },
            { name: 'Escribir y Corregir', code: 'escribirycorregir' },
            { name: 'Organización y Gestión', code: 'organygest' },
            { name: 'Accesorios y Mochilas', code: 'accesorios' },
        ];

        setProducts(loadFromLocalStorage('products', initialProducts));
        setCategoryOptions(loadFromLocalStorage('categories', initialCategories));
    }, []);

    // Guardar datos en localStorage cuando cambian
    useEffect(() => {
        saveToLocalStorage('products', products);
    }, [products]);

    useEffect(() => {
        saveToLocalStorage('categories', categoryOptions);
    }, [categoryOptions]);

    // Función para agregar un producto
    const addProduct = async (newProduct) => {
        try {
            setProducts(prevProducts => [...prevProducts, newProduct]);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    };

    // Actualizar producto
const updateProduct = (updatedProduct) => {
    try {
        // Actualizamos el producto buscando el id y reemplazando con los nuevos valores
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
            )
        );
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
};

    // Función para actualizar el stock de un producto específico
    const updateProductStock = async (id, newStock) => {
        try {
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === id ? { ...product, stock: newStock } : product
                )
            );
        } catch (error) {
            console.error('Error al actualizar el stock:', error);
        }
    };

    // Función para eliminar un producto
    const deleteProduct = async (id) => {
        try {
            setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    // Función para agregar una categoría
    const addCategory = async (newCategory) => {
        try {
            // Validación de las propiedades 'name' y 'code'
            if (!newCategory || !newCategory.name || !newCategory.code) {
                console.error('Error: La categoría debe tener un nombre y un código válidos.');
                return;
            }
    
            // Verificar si la categoría ya existe
            if (categoryOptions.some(category =>
                category.name.toLowerCase() === newCategory.name.toLowerCase() ||
                category.code.toLowerCase() === newCategory.code.toLowerCase()
            )) {
                console.error('La categoría ya existe.');
                return;
            }
    
            // Agregar la nueva categoría
            const updatedCategories = [...categoryOptions, newCategory];
            setCategoryOptions(updatedCategories); // Actualizar el estado
    
            // Guardar en localStorage
            saveToLocalStorage('categories', updatedCategories);
        } catch (error) {
            console.error('Error al agregar la categoría:', error);
        }
    };
    


    // Función para actualizar una categoría
    const updateCategory = (updatedCategory) => {
        setCategoryOptions((prevCategories) =>
            prevCategories.map((category) =>
                category.name === updatedCategory.oldName ? { ...category, name: updatedCategory.newName } : category
            )
        );
    };

    // Retornar el contexto con las funciones y estados
    return (
        <ProductContext.Provider value={{
            products,
            categoryOptions,
            addProduct,
            updateProductStock,
            deleteProduct,
            addCategory,
            updateCategory,
            updateProduct
        }}>
            {children}
        </ProductContext.Provider>
    );
};
