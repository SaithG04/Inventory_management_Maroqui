export class CategoryDTO {
  constructor(data) {
    // Asigna las propiedades del DTO usando Object.assign
    Object.assign(this, data);
  }

  // Método para convertir el DTO a un modelo de dominio
  toDomain() {
    return { ...this }; // Devuelve una copia del objeto DTO
  }

  // Método estático para crear un DTO desde un modelo de dominio
  static fromDomain(category) {
    return new CategoryDTO(category); // Crea un nuevo DTO usando el objeto del dominio
  }
}
