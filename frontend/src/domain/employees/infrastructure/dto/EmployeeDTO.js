export class EmployeeDTO {
    constructor(data) {
      // Asigna las propiedades del DTO usando Object.assign
      Object.assign(this, data);
    }
  
    toDomain() {
      // Devuelve una copia del objeto DTO con todos los campos necesarios
      return { ...this };
    }
  
    static fromDomain(employee) {
      // Crea un nuevo DTO directamente desde el objeto del dominio
      return new EmployeeDTO(employee);
    }
  }
  