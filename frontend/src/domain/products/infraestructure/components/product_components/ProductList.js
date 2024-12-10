import React, { useEffect, useState, useCallback, useMemo } from "react";
import ProductService from "../../../domain/services/ProductService";
import CategoryService from "../../../domain/services/CategoryService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import './ProductList.css';

const ProductList = ({ onEditProduct, refreshTrigger, products }) => {
  const [allProducts, setAllProducts] = useState([]);
  const productService = useMemo(() => new ProductService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);

  const fetchProducts = useCallback(async () => {
    try {
      // Obtener productos
      const productResponse = await productService.getAllProducts();
      const fetchedProducts = productResponse?.data || [];

      // Obtener categorías
      const categoryResponse = await categoryService.getAllCategories();
      const fetchedCategories = categoryResponse || [];

      // Mapear productos con nombres de categorías
      const validProducts = fetchedProducts.map((productData) => {
        const category = fetchedCategories.find((cat) => cat.id === productData.id_categoria);
        return {
          ...productData,
          nombre_categoria: category ? category.nombre : "Unknown", // Agregar nombre de categoría
        };
      });

      setAllProducts(validProducts);
    } catch (error) {
      console.error("Error fetching products or categories:", error);
      setAllProducts([]);
    }
  }, [productService, categoryService]);

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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshTrigger]);

  const displayProducts = products.length > 0 ? products : allProducts;

  return (
    <div className="product-list">
      <DataTable value={displayProducts} paginator rows={10} responsiveLayout="scroll">
        <Column field="nombre" header="Name" sortable />
        <Column field="codigo" header="Code" sortable />
        <Column field="descripcion" header="Description" />
        <Column field="unidad_medida" header="Unit Measurement" />
        <Column field="stock" header="Stock" />
        <Column field="nombre_categoria" header="Category Name" sortable />
        <Column field="estado" header="Status" />
        <Column
          body={(rowData) => (
            <div className="products-button-container">
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success products-button-edit"
                onClick={() => onEditProduct(rowData.id_producto)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger products-button-delete"
                onClick={() => onDeleteProduct(rowData.id_producto)}
              />
            </div>
          )}
          header="Actions"
        />
      </DataTable>
    </div>
  );
};

export default ProductList;
