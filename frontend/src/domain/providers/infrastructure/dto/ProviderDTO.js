export class ProviderDTO {
    constructor(data) {
      // Asigna las propiedades del DTO usando Object.assign
      Object.assign(this, data);
    }
  
    // Convierte el DTO a un objeto de dominio
    toDomain() {
      return { ...this }; // Devuelve una copia del objeto DTO
    }
  
    // Crea un nuevo DTO directamente desde el objeto del dominio
    static fromDomain(provider) {
      return new ProviderDTO(provider);
    }
  }
  