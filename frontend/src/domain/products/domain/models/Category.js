class Category {
  constructor({ id, nombre, descripcion, estado }) {
    this.id = id || null;
    this.nombre = nombre || ''; // Cambiado a 'nombre'
    this.descripcion = descripcion || ''; // Cambiado a 'descripcion'
    this.estado = estado || 'ACTIVE'; // Cambiado a 'estado'
  }

  validateNombre() {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Permitir letras, acentos y espacios
    if (!nameRegex.test(this.nombre)) {
      throw new Error('El nombre solo puede contener letras y espacios.');
    }
  }

  validateEstado() {
    const validStatuses = ['ACTIVE', 'INACTIVE'];
    if (!validStatuses.includes(this.estado.toUpperCase())) {
      throw new Error('El estado debe ser ACTIVE o INACTIVE.');
    }
  }

  validate() {
    this.validateNombre();
    this.validateEstado();
  }
}

export default Category;
