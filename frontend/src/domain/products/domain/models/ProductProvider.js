class ProductSupplier {
  constructor({ productSupplierId, productId, supplierId, price }) {
    this.productSupplierId = productSupplierId || null;
    this.productId = productId || null;
    this.supplierId = supplierId || null;
    this.price = price || 0.0; // Valor por defecto
  }

  // Validación del precio
  validatePrice() {
    if (this.price <= 0) {
      throw new Error('El precio debe ser un valor positivo.');
    }
  }

  // Método para validar todos los campos
  validate() {
    this.validatePrice();
  }
}

export default ProductSupplier;
