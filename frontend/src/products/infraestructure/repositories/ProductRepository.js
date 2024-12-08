import { ProductsHttp } from "../../../utils/ConHttp";
import { ProductDTO } from "../dto/ProductDTO";

class ProductRepository {
  async getAll() {
    const response = await ProductsHttp.get("/listProducts");
    return response.data.map((product) => new ProductDTO(product).toDomain());
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
    await ProductsHttp.delete(`/deleteProduct/${id}`);
  }
}

// Exportar la clase (no la instancia)
export default ProductRepository;
