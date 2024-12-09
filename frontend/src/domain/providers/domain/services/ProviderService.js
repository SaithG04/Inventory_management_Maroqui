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
}

export default ProviderService;
