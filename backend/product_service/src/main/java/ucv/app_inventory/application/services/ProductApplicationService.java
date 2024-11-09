package ucv.app_inventory.application.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import ucv.app_inventory.application.DTO.ProductDTO;
import ucv.app_inventory.domain.entities.Product;
import ucv.app_inventory.exception.ProductNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Component
public class ProductApplicationService {
    private final ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductApplicationService.class);

    public ProductApplicationService(ProductService productService) {
        this.productService = productService;
    }

    public List<ProductDTO> listProducts(int page, int size) {
        logger.info("Listing products with page: {}, size: {}", page, size);
        Page<Product> productsPage = productService.listProducts(page, size);
        return productsPage.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public ProductDTO saveProduct(ProductDTO productDto) {
        logger.info("Saving product: {}", productDto);
        Product product = convertToEntity(productDto);
        Product savedProduct = productService.saveProduct(product);
        logger.info("Product saved: {}", savedProduct);
        return convertToDto(savedProduct);
    }

    public void deleteProduct(Long id) {
        logger.info("Deleting product with id: {}", id);
        productService.deleteProduct(id);
        logger.info("Product deleted with id: {}", id);
    }

    public ProductDTO findProductById(Long id) {
        logger.info("Finding product by id: {}", id);
        Product product = productService.findProductById(id);
        if (product == null) {
            logger.warn("Product not found with id: {}", id);
            throw new ProductNotFoundException("El producto con id " + id + " no existe");

        }
        return convertToDto(product);
    }

    private ProductDTO convertToDto(Product product) {
        return new ProductDTO(
                product.getId(), product.getName(), product.getCode(), product.getDescription(),
                product.getUnitMeasurement(), product.getStock()
                , product.getCategoryId(), product.getStatus()
        );
    }

    private Product convertToEntity(ProductDTO productDto) {
        return new Product(
                productDto.getId(), productDto.getName(), productDto.getCode(), productDto.getDescription(),
                productDto.getUnitMeasurement(), productDto.getStock()
                , productDto.getCategoryId(), productDto.getStatus()
        );
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDto) {
        logger.info("Updating product with id: {}", id);
        Product existingProduct = productService.findProductById(id);
        if (existingProduct == null) {
            logger.warn("Product not found with id: {}", id);
            throw new ProductNotFoundException("Producto con id " + id + " no encontrado");
        }

        existingProduct.setName(productDto.getName());
        existingProduct.setCode(productDto.getCode());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setUnitMeasurement(productDto.getUnitMeasurement());
        existingProduct.setStock(productDto.getStock());
        existingProduct.setCategoryId(productDto.getCategoryId());
        existingProduct.setStatus(productDto.getStatus());


        Product updatedProduct = productService.saveProduct(existingProduct);
        logger.info("Product updated: {}", updatedProduct);
        return convertToDto(updatedProduct);
    }

    public List<ProductDTO> findProductsByName(String name) {
        logger.info("Finding products by name: {}", name);
        List<Product> products = productService.findProductsByName(name);
        if (products == null) {
            logger.warn("Product not found with id: {}", name);
            throw new ProductNotFoundException("El producto con el nombre " + name + " no existe");

        }
        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<ProductDTO> findProductsByStatus(Product.Status status) {
        logger.info("Finding products by status: {}", status);
        List<Product> products = productService.findProductsByStatus(status);
        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<ProductDTO> findProductsByCategoryName(String categoryName) {
        logger.info("Finding products by category name: {}", categoryName);
        List<Product> products = productService.findProductsByCategoryName(categoryName);
        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }

}
