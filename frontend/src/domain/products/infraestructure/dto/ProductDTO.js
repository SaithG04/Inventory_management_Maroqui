export class ProductDTO {
  constructor(data) {
    // Asigna las propiedades del DTO usando Object.assign
    Object.assign(this, data);
  }

  toDomain() {
    return { ...this }; // Devuelve una copia del objeto DTO
  }

  static fromDomain(product) {
    // Crea un nuevo DTO directamente desde el objeto del dominio
    return new ProductDTO(product);
  }
}
