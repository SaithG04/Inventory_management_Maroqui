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

  // Verificar si el producto está agotado
  isOutOfStock() {
    return this.stock === 0;
  }

  // Establecer el estado predeterminado basado en el stock
  setDefaultStatus() {
    this.status = this.isOutOfStock() ? 'OUT_OF_STOCK' : 'ACTIVE';
  }

  // Validar que el nombre permita letras, números, espacios, guiones y diagonales
  validateName() {
    const nameRegex = new RegExp('^[a-zA-Z0-9\\s\\-/]+$'); // Permitir letras, números, espacios, guiones y diagonales
    if (!nameRegex.test(this.name)) {
      throw new Error('Name can only contain letters, numbers, spaces, hyphens, and slashes.');
    }
  }

  // Validar que el stock sea un número no negativo
  validateStock() {
    if (!Number.isInteger(this.stock) || this.stock < 0) {
      throw new Error('Stock must be a non-negative integer.');
    }
  }

  // Validar que la categoría sea válida
  validateCategory() {
    if (!this.category_id) {
      throw new Error('Category is required.');
    }
  }

  // Método para validar todos los campos relevantes
  validate() {
    this.validateName(); // Validar el nombre
    this.validateStock(); // Validar el stock
    this.validateCategory(); // Validar la categoría
  }
}

export default Product;
