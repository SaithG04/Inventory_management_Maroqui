import React, { useState, useEffect, useMemo, useRef } from "react";
import ProductService from "../../../../products/domain/services/ProductService";
import ProductProviderService from "../../../domain/services/ProductProviderService";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

const ProductProviderForm = ({ suppliers, onSave, onCancel }) => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [price, setPrice] = useState(null);
  const toast = useRef(null);

  // Usar useMemo para memoizar productService
  const productService = useMemo(() => new ProductService(), []);
  const productProviderService = useMemo(() => new ProductProviderService(), []);

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productService.getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al cargar los productos.",
        });
      }
    };

    fetchProducts();
  }, [productService]); // productService ya no cambiará debido a useMemo

  // Guardar la relación
  const handleSave = async () => {
    if (!selectedProductId || !selectedSupplierId || !price) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor, complete todos los campos.",
      });
      return;
    }

    try {
      const productSupplierData = {
        productId: selectedProductId,
        supplierId: selectedSupplierId,
        price: price,
      };

      await productProviderService.createProductSupplierRelation(
        selectedProductId,
        selectedSupplierId
      );

      onSave(productSupplierData);

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "La relación producto-proveedor fue guardada correctamente.",
      });
    } catch (error) {
      console.error("Error al guardar la relación:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la relación.",
      });
    }
  };

  return (
    <div className="add-product-form">
      <Toast ref={toast} />
      <h1>Formulario de Relación Producto-Proveedor</h1>

      {/* Selección de Producto */}
      <div className="form-row">
        <Dropdown
          id="product"
          value={selectedProductId}
          options={products.map((product) => ({
            label: product.name, // Mostrar el nombre del producto
            value: product.id, // Usar el ID del producto
          }))}
          onChange={(e) => setSelectedProductId(e.value)}
          placeholder="Seleccione un producto"
        />
      </div>

      {/* Selección de Proveedor */}
      <div className="form-row">
        <Dropdown
          id="supplier"
          value={selectedSupplierId}
          options={Array.isArray(suppliers) ? suppliers.map((supplier) => ({
            label: supplier.name, // Mostrar el nombre del proveedor
            value: supplier.id, // Usar el ID del proveedor
          })) : []} // Fallback si suppliers no es un array
          onChange={(e) => setSelectedSupplierId(e.value)}
          placeholder="Seleccione un proveedor"
        />
      </div>

      {/* Entrada de Precio */}
      <div className="form-row">
        <InputNumber
          id="price"
          value={price}
          onValueChange={(e) => setPrice(e.value)}
          mode="currency"
          currency="USD"
          placeholder="Ingrese el precio"
        />
      </div>

      {/* Botones */}
      <div className="form-buttons">
        <Button
          label="Guardar"
          icon="pi pi-check"
          className="p-button p-button-success"
          onClick={handleSave}
        />
        <Button
          label="Cancelar"
          icon="pi pi-times"
          className="p-button p-button-secondary"
          onClick={onCancel}
        />
      </div>
    </div>
  );
};

export default ProductProviderForm;
