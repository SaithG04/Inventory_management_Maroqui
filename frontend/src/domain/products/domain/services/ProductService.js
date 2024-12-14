import ProductRepository from "../../infraestructure/repositories/ProductRepository";

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository(); // Inicializar correctamente
  }

  async getAllProducts() {
    return await this.productRepository.getAll();
  }

  async isProductNameUnique(name) {
    const products = await this.productRepository.findByName(name);
    return Array.isArray(products) ? products : []; // Garantizamos que sea un array
  }

  
  async getProductById(id) {
    return await this.productRepository.getById(id);
  }

  async createProduct(product) {
    return await this.productRepository.create(product);
  }

  async updateProduct(id, product) {
    return await this.productRepository.update(id, product);
  }

  async deleteProduct(id) {
    return await this.productRepository.delete(id);
  }
}

export default ProductService; // Exportar el servicio como clase
