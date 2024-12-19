// src/repositories/CategoryRepository.js
import { Http } from "../http/ConHttp";
import { CategoryDTO } from "../http/dto/CategoryDTO";
import Cookies from 'js-cookie'; // Necesitas importar js-cookie si aún no lo has hecho

export class CategoryRepository {
  // Obtener todas las categorías
  async getAll() {
    const token = Cookies.get('jwtToken'); // Obtener el token JWT desde las cookies
    const response = await Http.get(process.env.REACT_APP_API_CATEGORIES_PATH, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluir el token en la cabecera Authorization
      },
    });
    return response.data.map((category) => new CategoryDTO(category).toDomain());
  }

  // Obtener una categoría por ID
  async getById(id) {
    const token = Cookies.get('jwtToken');
    const response = await Http.get(`${process.env.REACT_APP_API_CATEGORIES_PATH}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return new CategoryDTO(response.data).toDomain();
  }

  // Crear una nueva categoría
  async create(category) {
    const token = Cookies.get('jwtToken');
    const categoryDTO = CategoryDTO.fromDomain(category);
    const response = await Http.post(process.env.REACT_APP_API_CATEGORIES_PATH, categoryDTO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return new CategoryDTO(response.data).toDomain();
  }

  // Actualizar una categoría
  async update(id, category) {
    const token = Cookies.get('jwtToken');
    const categoryDTO = CategoryDTO.fromDomain(category);
    const response = await Http.put(`${process.env.REACT_APP_API_CATEGORIES_PATH}/${id}`, categoryDTO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return new CategoryDTO(response.data).toDomain();
  }

  // Eliminar una categoría
  async delete(id) {
    const token = Cookies.get('jwtToken');
    await Http.delete(`${process.env.REACT_APP_API_CATEGORIES_PATH}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
