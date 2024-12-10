import { CategoriesHttp } from "../../../../utils/ConHttp";
import { CategoryDTO } from "../dto/CategoryDTO";

class CategoryRepository {
  async getAll() {
    const response = await CategoriesHttp.get("/list");
    return response.data.map((category) => new CategoryDTO(category).toDomain());
  }

  async getById(id) {
    const response = await CategoriesHttp.get(`/findCategoryById/${id}`);
    return new CategoryDTO(response.data).toDomain();
  }

  async create(category) {
    const categoryDTO = CategoryDTO.fromDomain(category);
    const response = await CategoriesHttp.post("/saveCategory", categoryDTO);
    return new CategoryDTO(response.data).toDomain();
  }

  async update(id, category) {
    const categoryDTO = CategoryDTO.fromDomain(category);
    const response = await CategoriesHttp.put(
      `/updateCategory/${id}`,
      categoryDTO
    );
    return new CategoryDTO(response.data).toDomain();
  }

  async delete(id) {
    await CategoriesHttp.delete(`/deleteCategory/${id}`);
  }
}

export default CategoryRepository;
