export class CategoryDTO {
  constructor({ id, name, description, status }) {
    this.id = id;
    this.nombre = name;
    this.descripcion = description;
    this.estado = status;
  }

  static fromDomain(category) {
    return new CategoryDTO({ ...category });
  }

  toDomain() {
    return { ...this };
  }
}
