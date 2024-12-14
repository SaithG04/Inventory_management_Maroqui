class Product {
  constructor({ id, nombre, descripcion, unidad_medida, stock, nombre_categoria, estado, precio_venta }) {
    this.id = id || null;
    this.nombre = nombre || ""; // Asegúrate de que aquí se está asignando 'nombre'
    this.descripcion = descripcion || "";
    this.unidad_medida = unidad_medida || "UN";
    this.stock = stock || 0;
    this.nombre_categoria = nombre_categoria || "";
    this.estado = estado || "ACTIVE";
    this.precio_venta = precio_venta || 0;
  }

  isOutOfStock() {
    return this.stock === 0;
  }

  setDefaultStatus() {
    this.status = this.isOutOfStock() ? 'OUT_OF_STOCK' : 'ACTIVE';
  }

  validateName() {
    const nameRegex = new RegExp('^[a-zA-Z0-9\\s\\-/]+$');
    console.log("Validando nombre:", this.nombre); // <-- Aquí debería imprimir el valor correcto
    if (!nameRegex.test(this.nombre)) {
      throw new Error("El nombre solo puede contener letras, números, espacios, guiones y barras.");
    }
  }

  validateStock() {
    if (!Number.isInteger(this.stock) || this.stock < 0) {
      throw new Error('Stock must be a non-negative integer.');
    }
  }

  validateCategory() {
    if (!this.nombre_categoria || this.nombre_categoria.trim() === "") {
      throw new Error("Category is required.");
    }
  }

  validate() {
    this.validateName();
    this.validateStock();
    this.validateCategory();
  }
}

export default Product;
