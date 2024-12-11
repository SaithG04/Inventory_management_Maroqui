// src/domain/services/ProviderService.js
import ProviderRepository from "../../infrastructure/repositories/ProviderRepository";

class ProviderService {
  constructor() {
    this.providerRepository = new ProviderRepository();
  }

  async getAllProviders(page, size) {
    return await this.providerRepository.getAll(page, size);
  }

  async getProviderById(id) {
    return await this.providerRepository.getById(id);
  }

  async createProvider(provider) {
    return await this.providerRepository.create(provider);
  }

  async updateProvider(id, provider) {
    return await this.providerRepository.update(id, provider);
  }

  async deleteProvider(id) {
    return await this.providerRepository.delete(id);
  }

  // Método para buscar proveedores por nombre
  async findByName(name) {
    const response = await this.providerRepository.findByName(name);
    return response?.data?.content || [];  // Acceder a los datos correctamente
  }

  // Método para buscar proveedores por estado
  async findByStatus(status, page = 0, size = 15) {
    const response = await this.providerRepository.findByStatus(status, page, size);
    return response?.data?.content || [];  // Acceder a los datos correctamente
  }
}

export default ProviderService;
