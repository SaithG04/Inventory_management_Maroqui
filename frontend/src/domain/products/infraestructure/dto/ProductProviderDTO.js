class ProductSupplierDTO {
  constructor(data) {
    Object.assign(this, data); // Asigna las propiedades usando Object.assign
  }

  // Método para convertir el DTO a un modelo de dominio
  toDomain() {
    return { ...this }; // Devuelve una copia del objeto DTO
  }

  // Método estático para crear un DTO desde un modelo de dominio
  static fromDomain(productSupplier) {
    return new ProductSupplierDTO(productSupplier); // Crea un nuevo DTO usando el objeto del dominio
  }
}

export default ProductSupplierDTO;
