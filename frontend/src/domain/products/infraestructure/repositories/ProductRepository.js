import { ProductsHttp } from "../../../../utils/ConHttp";
import { ProductDTO } from "../dto/ProductDTO";

class ProductRepository {
  async getAll() {
    const response = await ProductsHttp.get("/listProducts");
    return response.data.map((product) => new ProductDTO(product).toDomain());
  }

  async findByName(name) {
    const response = await ProductsHttp.get(`/findByName`, {
      params: { name }, // Usamos `params` para enviar el nombre
    });
    return response.data || []; // Retorna un array vacío si no hay resultados
  }
  
  

  async getById(id) {
    const response = await ProductsHttp.get(`/findProductById/${id}`);
    return new ProductDTO(response.data).toDomain();
  }

  async create(product) {
    const productDTO = ProductDTO.fromDomain(product);
    const response = await ProductsHttp.post("/saveProduct", productDTO);
    return new ProductDTO(response.data).toDomain();
  }

  async update(id, product) {
    const productDTO = ProductDTO.fromDomain(product);
    const response = await ProductsHttp.put(`/updateProduct/${id}`, productDTO);
    return new ProductDTO(response.data).toDomain();
  }

  async delete(id) {
    try {
      const response = await ProductsHttp.delete(`/deleteProduct/${id}`);
      if (response.status === 204) {
        console.log("Producto eliminado exitosamente:", id);
      } else {
        console.error("Respuesta inesperada al eliminar producto:", response);
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  }
  
}

// Exportar la clase (no la instancia)
export default ProductRepository;
