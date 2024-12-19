// src/repositories/ProductRepository.js
import { Http } from "../../../utils/ConHttp";

class ProductRepository {
  // Obtener todos los productos
  async getAll(page = 0, size = 15) {
    const response = await Http.get(`${process.env.REACT_APP_API_PRODUCTS_PATH}/listProducts?page=${page}&size=${size}`);
    return response;
  }

  // Obtener un producto por ID
  async getById(id) {
    const response = await Http.get(`${process.env.REACT_APP_API_PRODUCTS_PATH}/findProductById/${id}`);
    return response;
  }

  // Crear un nuevo producto
  async create(product) {
    const response = await Http.post(`${process.env.REACT_APP_API_PRODUCTS_PATH}/saveProduct`, product);
    return response;
  }

  // Actualizar un producto
  async update(id, product) {
    const response = await Http.put(`${process.env.REACT_APP_API_PRODUCTS_PATH}/updateProduct/${id}`, product);
    return response;
  }

  // Eliminar un producto
  async delete(id) {
    await Http.delete(`${process.env.REACT_APP_API_PRODUCTS_PATH}/deleteProduct/${id}`);
  }

  // Buscar productos por nombre
  async findByName(name, page = 0, size = 15) {
    const response = await Http.get(
      `${process.env.REACT_APP_API_PRODUCTS_PATH}/findByName?name=${name}&page=${page}&size=${size}`
    );
    return response;
  }

  // Buscar productos por estado
  async findByStatus(status, page = 0, size = 15) {
    const response = await Http.get(
      `${process.env.REACT_APP_API_PRODUCTS_PATH}/findByStatus?status=${status}&page=${page}&size=${size}`
    );
    return response;
  }

  // Buscar productos por nombre de categoría
  async findByCategoryName(categoryName, page = 0, size = 15) {
    const response = await Http.get(
      `${process.env.REACT_APP_API_PRODUCTS_PATH}/findByCategoryName?categoryName=${categoryName}&page=${page}&size=${size}`
    );
    return response;
  }
}

export default ProductRepository;
