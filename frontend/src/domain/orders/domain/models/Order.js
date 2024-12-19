class Order {
  constructor({ id, supplier, date, status, products = [] }) {
    this.id = id || null;
    this.supplier = supplier || ''; // Nombre o identificación del proveedor
    this.date = date || new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
    this.status = status || 'PENDING'; // Estados posibles: PENDING, PROCESSED, CANCELED
    this.products = products; // Lista de productos con sus cantidades
  }

  // Verificar si el pedido está procesado
  isProcessed() {
    return this.status === 'PROCESSED';
  }

  // Verificar si el pedido está cancelado
  isCanceled() {
    return this.status === 'CANCELED';
  }

  // Validar que el pedido tenga un proveedor
  validateSupplier() {
    if (!this.supplier) {
      throw new Error('Supplier is required.');
    }
  }

  // Validar que el pedido tenga al menos un producto
  validateProducts() {
    if (this.products.length === 0) {
      throw new Error('At least one product is required.');
    }

    // Validar que cada producto tenga una cantidad válida
    this.products.forEach((product, index) => {
      if (!product.quantity || product.quantity <= 0) {
        throw new Error(`Product at index ${index} must have a valid quantity greater than 0.`);
      }
    });
  }

  // Validar el estado del pedido
  validateStatus() {
    const validStatuses = ['PENDING', 'PROCESSED', 'CANCELED'];
    if (!validStatuses.includes(this.status)) {
      throw new Error(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
    }
  }

  // Método general para validar el pedido
  validate() {
    this.validateSupplier();
    this.validateProducts();
    this.validateStatus();
  }
}

export default Order;
