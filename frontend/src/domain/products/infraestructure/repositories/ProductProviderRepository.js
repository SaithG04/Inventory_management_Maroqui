// ProductProviderRepository.js

import { ProductsHttp } from "./http"; // Configuración HTTP para productos
import { SuppliersHttp } from "./http"; // Configuración HTTP para proveedores
import { ProductProviderDTO } from "../models/ProductProviderDTO"; // DTO para la relación Producto-Proveedor

class ProductProviderRepository {
  // Método para obtener la relación entre un producto y un proveedor por su ID
  async findById(id) {
    try {
      const response = await ProductsHttp.get(`/product-supplier/findById/${id}`);
      return new ProductProviderDTO(response.data); // Asumiendo que la respuesta contiene los datos correctos
    } catch (error) {
      console.error("Error al obtener la relación producto-proveedor:", error);
      throw error;
    }
  }

  // Método para obtener todos los proveedores de un producto
  async getSuppliersForProduct(productId) {
    try {
      const response = await ProductsHttp.get(`/product-supplier/${productId}/suppliers`);
      return response.data; // Suponiendo que la respuesta es una lista de proveedores
    } catch (error) {
      console.error("Error al obtener proveedores para el producto:", error);
      throw error;
    }
  }

  // Método para obtener todos los productos de un proveedor
  async getProductsForSupplier(supplierId) {
    try {
      const response = await ProductsHttp.get(`/product-supplier/supplier/${supplierId}`);
      return response.data; // Suponiendo que la respuesta es una lista de productos
    } catch (error) {
      console.error("Error al obtener productos para el proveedor:", error);
      throw error;
    }
  }

  // Método para agregar un nuevo proveedor para un producto
  async addSupplierToProduct(productId, supplierId, price) {
    try {
      const response = await ProductsHttp.post(`/product-supplier/${productId}/suppliers/${supplierId}`, {
        price, // Aquí enviamos el precio en la solicitud
      });
      return response.data; // Suponiendo que la respuesta contiene la relación creada
    } catch (error) {
      console.error("Error al agregar proveedor al producto:", error);
      throw error;
    }
  }

  // Método para eliminar la relación entre producto y proveedor
  async removeSupplierFromProduct(productId, supplierId) {
    try {
      const response = await ProductsHttp.delete(`/product-supplier/${productId}/suppliers/${supplierId}`);
      return response.data; // Respuesta que confirme la eliminación
    } catch (error) {
      console.error("Error al eliminar proveedor del producto:", error);
      throw error;
    }
  }

  // Método para verificar si existe la relación entre producto y proveedor
  async checkIfSupplierExistsForProduct(productId, supplierId) {
    try {
      const response = await ProductsHttp.get(`/product-supplier/${productId}/suppliers/${supplierId}/exists`);
      return response.data.exists; // Suponiendo que la respuesta tiene un campo 'exists'
    } catch (error) {
      console.error("Error al verificar la existencia del proveedor para el producto:", error);
      throw error;
    }
  }
}

export default new ProductProviderRepository(); // Exporta la instancia del repositorio
