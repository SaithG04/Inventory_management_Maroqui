class Product {
    constructor({ id, name, code, description, unitMeasurement, stock, category_id, status }) {
      this.id = id || null;
      this.name = name || '';
      this.code = code || '';
      this.description = description || '';
      this.unitMeasurement = unitMeasurement || 'UN'; // UN, MT, CJ
      this.stock = stock || 0;
      this.category_id = category_id || null;
      this.status = status || 'ACTIVE'; // ACTIVE, DISCONTINUED, OUT_OF_STOCK
    }
  
    isOutOfStock() {
      return this.stock === 0;
    }
  
    setDefaultStatus() {
      this.status = this.isOutOfStock() ? 'OUT_OF_STOCK' : 'ACTIVE';
    }
  }
  
  export default Product;
  