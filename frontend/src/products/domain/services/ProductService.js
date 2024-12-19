import ProductRepository from "../../infraestructure/repositories/ProductRepository";

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(page, size) {
    return await this.productRepository.getAll(page, size);
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
  async findByName(name, page, size) {
    return await this.productRepository.findByName(name, page, size);
  }

  async findByStatus(status, page, size) {
    return await this.productRepository.findByStatus(status, page, size);
  }

  async findByCategoryName(categoryName, page, size) {
    return await this.productRepository.findByCategoryName(categoryName, page, size);
  }
}

export default ProductService;