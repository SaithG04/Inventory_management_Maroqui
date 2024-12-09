import React, { useEffect, useState, useCallback, useMemo } from "react";
import ProductService from "../../../domain/services/ProductService";
import { ProductDTO } from "../../dto/ProductDTO";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import './ProductList';  // Asegúrate de importar el archivo de estilo

const ProductList = ({ onEditProduct, refreshTrigger, products }) => {
  const [allProducts, setAllProducts] = useState([]);
  const productService = useMemo(() => new ProductService(), []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productService.getAllProducts();
      const fetchedProducts = response?.data || [];
      console.log(fetchedProducts);

      if (fetchedProducts.length === 0) {
        console.log('No products found');
        setAllProducts([]);
        return;
      }

      const validProducts = fetchedProducts
        .map((productData) => {
          if (
            !productData.id_producto ||
            !productData.nombre ||
            !productData.estado ||
            typeof productData.id_producto !== 'number' ||
            typeof productData.nombre !== 'string' || productData.nombre.trim() === '' ||
            !['ACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK'].includes(productData.estado)
          ) {
            console.error('Invalid product data:', productData);
            return null;
          }

          try {
            const productDTO = new ProductDTO(productData);
            return productDTO.toDomain();
          } catch (err) {
            console.error('Error converting product to domain:', productData, err);
            return null;
          }
        })
        .filter((product) => product !== null);

      console.log("Valid Products:", validProducts);
      setAllProducts(validProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
    }
  }, [productService]);

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
        <Column field="id_categoria" header="Category ID" />
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
