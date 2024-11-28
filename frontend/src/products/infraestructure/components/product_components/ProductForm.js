import React, { useState, useEffect } from "react";
import ProductService from "../../../domain/services/ProductService";
import { ProductDTO } from "../../dto/ProductDTO";

const ProductForm = ({ productId, onProductSaved }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    unit_measurement: null,
    stock: 0,
    category_id: 0,
    status: "OUT_OF_STOCK",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const productService = new ProductService();

  useEffect(() => {
    if (productId) {
      setIsEditMode(true);
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await productService.getProductById(productId);
          console.log("Fetched product: ", response.data);  // Debugging line
          setProductData(response.data); // Accede a 'data' para actualizar el estado
        } catch (error) {
          setError("Error fetching product details.");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setIsEditMode(false);
      setProductData({
        name: "",
        description: "",
        unit_measurement: null,
        stock: 0,
        category_id: 0,
        status: "OUT_OF_STOCK",
      });
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación de campos obligatorios
    if (!productData.name || !productData.category_id) {
      setError("Name and Category ID are required.");
      setLoading(false);
      return;
    }

    // Convertir el formulario en un DTO antes de enviar
    const productDTO = new ProductDTO(productData);

    try {
      if (isEditMode) {
        await productService.updateProduct(productId, productDTO.toDomain());
      } else {
        await productService.createProduct(productDTO.toDomain());
      }
      onProductSaved(); // Llama a la función para refrescar la lista
      setProductData({
        name: "",
        description: "",
        unit_measurement: null,
        stock: 0,
        category_id: 0,
        status: "OUT_OF_STOCK",
      });
    } catch (error) {
      setError("Error saving product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{isEditMode ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Product Name *"
            value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
          />
        </div>
        <div>
          <textarea
            placeholder="Description (optional)"
            value={productData.description}
            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
          ></textarea>
        </div>
        <div>
          <select
            value={productData.unit_measurement || ""}
            onChange={(e) =>
              setProductData({
                ...productData,
                unit_measurement: e.target.value || null,
              })
            }
          >
            <option value="">Select Unit (optional)</option>
            <option value="UN">Unit (UN)</option>
            <option value="CJ">Box (CJ)</option>
            <option value="MT">Meter (MT)</option>
          </select>
        </div>
        <div>
          <input
            type="number"
            placeholder="Stock (default: 0)"
            value={productData.stock}
            readOnly
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Category ID *"
            value={productData.category_id}
            onChange={(e) => setProductData({ ...productData, category_id: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <select
            value={productData.status}
            onChange={(e) => setProductData({ ...productData, status: e.target.value })}
          >
            <option value="ACTIVE">Active</option>
            <option value="DISCONTINUED">Discontinued</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
