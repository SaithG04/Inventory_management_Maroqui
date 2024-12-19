class ProductProviderService {
  // Método común para manejar las solicitudes HTTP
  async request(url, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Error al realizar la solicitud a ${url}`);
      }

      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Método para obtener todas las relaciones producto-proveedor
  async getAllRelations(productId) {
    return this.request(`/api/product-supplier/${productId}/suppliers`);
  }
  

  // Obtener un producto y proveedor por ID
  async getProductSupplierById(id) {
    return this.request(`/api/product-supplier/findById/${id}`);
  }

  // Obtener todos los proveedores de un producto
  async getSuppliersByProductId(productId) {
    return this.request(`/api/product-supplier/product/${productId}`);
  }

  // Obtener todos los productos de un proveedor
  async getProductsBySupplierId(supplierId) {
    const response = await fetch(`/api/product-supplier/supplier/${supplierId}`);
    if (!response.ok) {
      throw new Error(`Error al llamar al endpoint: ${response.statusText}`);
    }
    return response.json(); // Asegúrate de que la respuesta sea JSON válido
  }
  

  // Obtener todos los proveedores de un producto
  async getSuppliersForProduct(productId) {
    return this.request(`/api/product-supplier/${productId}/suppliers`);
  }

  // Verificar si una relación producto-proveedor existe
  async checkProductSupplierExists(productId, supplierId) {
    return this.request(`/api/product-supplier/${productId}/suppliers/${supplierId}/exists`);
  }

  // Crear una relación entre un producto y un proveedor
  async createProductSupplierRelation(productId, supplierId) {
    return this.request(`/api/product-supplier/${productId}/suppliers/${supplierId}`, 'POST');
  }

  // Eliminar una relación entre un producto y un proveedor
  async deleteProductSupplierRelation(productId, supplierId) {
    return this.request(`/api/product-supplier/${productId}/suppliers/${supplierId}`, 'DELETE');
  }
}

export default ProductProviderService;
