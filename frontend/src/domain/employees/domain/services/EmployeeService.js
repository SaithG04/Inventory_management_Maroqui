// src/domain/services/EmployeeService.js
import EmployeeRepository from "../../infrastructure/repositories/EmployeeRepository";

class EmployeeService {
  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }


  // Búsqueda por email
async findByEmail(email) {
  console.log('Buscando empleados con los siguientes parámetros:', { email });

  try {
    // Llamada al repositorio para obtener los empleados
    const response = await this.employeeRepository.findByEmail(email);

    // Revisamos la respuesta completa
    console.log('Respuesta de la búsqueda:', response);

    // Verificamos si la respuesta contiene un objeto con los datos esperados
    if (response && response.data) {
      // Si la respuesta contiene datos, los devolvemos como un array (aunque sea un solo empleado)
      return [response.data]; // Colocamos los datos dentro de un array
    }

    // Si la respuesta no contiene datos válidos, retornamos un arreglo vacío
    return [];
  } catch (error) {
    console.error('Error al buscar empleados:', error);
    throw error; // Lanzamos el error para que el componente que llama pueda manejarlo
  }
}


  // Obtener todos los empleados con paginación
  async getAllEmployees(page, size) {
    return await this.employeeRepository.getAll(page, size);
  }

  // Crear un nuevo empleado
  async createEmployee(employee) {
    return await this.employeeRepository.create(employee);
  }

  // Actualizar un empleado existente
  async updateEmployee(id, employee) {
    return await this.employeeRepository.update(id, employee);
  }

  // Eliminar un empleado por su ID
  async deleteEmployee(id) {
    return await this.employeeRepository.delete(id);
  }

  // Actualizar el estado de un empleado (activo/inactivo)
  async updateEmployeeStatus(id, isActive) {
    return await this.employeeRepository.updateStatus(id, isActive);
  }


  // **Asignar un rol a un empleado**
  async assignRole(id, roleName) {
    return await this.employeeRepository.assignRole(id, roleName);
  }

}

export default EmployeeService;
