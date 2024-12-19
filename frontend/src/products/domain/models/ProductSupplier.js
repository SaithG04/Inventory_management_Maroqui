class ProductSupplier {
    constructor({ id, productId, supplierId, price }) {
      this.id = id || null;
      this.productId = productId || null;
      this.supplierId = supplierId || null;
      this.price = price || 0.0;
    }
  }
  
  export default ProductSupplier;
  