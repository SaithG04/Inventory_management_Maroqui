export class CategoryDTO {
    constructor({ id, name, description, status }) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.status = status;
    }
  
    static fromDomain(category) {
        return new CategoryDTO({ ...category });
      }
    
      toDomain() {
        return { ...this };
      }
  }
