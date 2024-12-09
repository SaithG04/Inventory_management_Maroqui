import CategoryRepository from "../../infraestructure/repositories/CategoryRepository";

class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository(); // Ahora funciona porque estás importando la clase
  }

  async getAllCategories() {
    return await this.categoryRepository.getAll();
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
