// src/repositories/ProviderRepository.js
import { SuppliersHttp } from "../../../../utils/ConHttp";

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

  // Buscar proveedores por nombre
  async findByName(name) {
    const response = await SuppliersHttp.get(`/findByName?name=${name}`);
    return response;
  }

  // Obtener proveedores por estado
  async findByStatus(status, page = 0, size = 15) {
    const response = await SuppliersHttp.get(`/findByStatus?status=${status}&page=${page}&size=${size}`);
    return response;
  }

  // Crear un nuevo proveedor
  async create(provider) {
    // Verificar si ya existe un proveedor con el mismo nombre
    const existingProvider = await this.findByName(provider.name);
    if (existingProvider.data.length > 0) {
      throw new Error("Ya existe un proveedor con este nombre.");
    }
    const response = await SuppliersHttp.post("/create", provider);
    return response;
  }

  // Actualizar un proveedor existente
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
