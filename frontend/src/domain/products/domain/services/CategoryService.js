import CategoryRepository from "../../infraestructure/repositories/CategoryRepository";

class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAllCategories() {
    return await this.categoryRepository.getAll();
  }

  async getCategoryByName(name) {
    return await this.categoryRepository.getByName(name);
  }

  async getCategoryByStatus(status) {
    return await this.categoryRepository.getByStatus(status);
  }

  async getCategoryById(id) {
    return await this.categoryRepository.getById(id);
  }

  async createCategory(category) {
    return await this.categoryRepository.create(category);
  }

  async updateCategory(id, category) {
    return await this.categoryRepository.update(id, category);
  }

  async deleteCategory(id) {
    return await this.categoryRepository.delete(id);
  }
}

export default CategoryService;
