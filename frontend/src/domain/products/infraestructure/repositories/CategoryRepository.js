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

  async getByStatus(status) {
    const response = await CategoriesHttp.get("/findByStatus", {
      params: { status },
    });
    return response.data.map((category) => new CategoryDTO(category).toDomain());
  }
  

  async getByName(name) {
    const response = await CategoriesHttp.get(`/findByName?name=${encodeURIComponent(name)}`);
    return new CategoryDTO(response.data).toDomain();
  }
  
  async create(category) {
    const categoryDTO = CategoryDTO.fromDomain(category);
    const response = await CategoriesHttp.post("/save", categoryDTO); // Endpoint de creación
    return new CategoryDTO(response.data).toDomain();
  }

  // Actualizar una categoría existente
  async update(id, category) {
    const categoryDTO = CategoryDTO.fromDomain(category);
    const response = await CategoriesHttp.put(`/update/${id}`, categoryDTO); // Endpoint de actualización
    return new CategoryDTO(response.data).toDomain();
  }

  async delete(id) {
    await CategoriesHttp.delete(`/delete/${id}`);
  }
}

export default CategoryRepository;
