// src/repositories/ProviderRepository.js
import { SuppliersHttp } from "../../../utils/ConHttp";

class ProviderRepository {
  // Obtener todos los proveedores
  async getAll(page = 0, size = 15) {
    const response = await SuppliersHttp.get(`/listAll?page=${page}&size=${size}`);
    return response;
  }

  // Obtener un proveedor por ID
  async getById(id) {
    const response = await SuppliersHttp.get(`/getById/${id}`);
    return response;
  }

  // Obtener un proveedor por ID
  async findByStatus(status, page = 0, size = 15) {
    const response = await SuppliersHttp.get(`/findByStatus?status=${status}&page=${page}&size=${size}`);
    return response;
  }

  // Crear un nuevo proveedor
  async create(provider) {
    const response = await SuppliersHttp.post("/create", provider);
    return response;
  }

  // Actualizar un proveedor
  async update(id, provider) {
    const response = await SuppliersHttp.put(`/update/${id}`, provider);
    return response;
  }

  // Eliminar un proveedor
  async delete(id) {
    await SuppliersHttp.delete(`/delete/${id}`);
  }

}

export default ProviderRepository;
