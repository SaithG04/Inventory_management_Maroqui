// src/repositories/EmployeeRepository.js
import { EmployeesHttp } from "../../../../utils/ConHttp";

class EmployeeRepository {
  // Obtener todos los empleados
  async getAll(page = 0, size = 15) {
    const response = await EmployeesHttp.get(`/listAll?page=${page}&size=${size}`);
    return response;
  }

  // Obtener un empleado por ID
  async getById(id) {
    const response = await EmployeesHttp.get(`/getById/${id}`);
    return response;
  }

  // Crear un nuevo empleado
  async create(employee) {
    const response = await EmployeesHttp.post("/create", employee);
    return response;
  }

  // Actualizar un empleado
  async update(id, employee) {
    const response = await EmployeesHttp.put(`/update/${id}`, employee);
    return response;
  }

  // Eliminar un empleado
  async delete(id) {
    await EmployeesHttp.delete(`/delete/${id}`);
  }

  // Actualizar el estado de un empleado
  async updateStatus(id, status) {
    const response = await EmployeesHttp.patch(`/updateStatus/${id}`, { status });
    return response;
  }
}

export default EmployeeRepository;
