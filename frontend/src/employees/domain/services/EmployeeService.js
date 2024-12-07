// src/domain/services/EmployeeService.js
import EmployeeRepository from "../../infrastructure/repositories/EmployeeRepository";

class EmployeeService {
  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  // Obtener todos los empleados con paginación
  async getAllEmployees(page, size) {
    return await this.employeeRepository.getAll(page, size);
  }

  // Obtener un empleado por su ID
  async getEmployeeById(id) {
    return await this.employeeRepository.getById(id);
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
  async updateEmployeeStatus(id, status) {
    return await this.employeeRepository.updateStatus(id, status);
  }
}

export default EmployeeService;
