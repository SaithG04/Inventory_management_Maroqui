package ucv.app_inventory.application.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import ucv.app_inventory.application.DTO.ProductDTO;
import ucv.app_inventory.domain.entities.Product;
import ucv.app_inventory.exception.CategoryNotFoundException;
import ucv.app_inventory.exception.ProductNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Component
public class ProductApplicationService {

    private final ProductService productService;
    private final CategoryService categoryService;
    private static final Logger logger = LoggerFactory.getLogger(ProductApplicationService.class);

    public ProductApplicationService(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    public List<ProductDTO> listProducts(int page, int size) {
        logger.info("Listing products");
        Page<Product> productsPage = productService.listProducts(page, size);
        return productsPage.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public ProductDTO saveProduct(ProductDTO productDto) {
        logger.info("Saving product");
        Product product = convertToEntity(productDto);
        Product savedProduct = productService.createProduct(product);
        logger.info("Product saved");
        return convertToDto(savedProduct);
    }

    public void deleteProduct(Long id) {
        getInfo(id);
        Product product = productService.findProductById(id);
        if (product == null) {
            getWarn(id);
            throw new ProductNotFoundException("Producto no encontrado con id: " + id);
        }
        logger.info("Deleting product");
        productService.deleteProduct(product);
        logger.info("Product deleted");
    }

    private static void getWarn(Long id) {
        logger.warn("Producto no encontrado con id: {}", id);
    }

    private static void getInfo(Long id) {
        logger.info("Buscando producto por id: {}", id);
    }

    public ProductDTO findProductById(Long id) {
        getInfo(id);
        Product product = productService.findProductById(id);
        if (product == null) {
            getWarn(id);
            throw new ProductNotFoundException("Producto no encontrado con id: " + id);
        }
        return convertToDto(product);
    }

    private ProductDTO convertToDto(Product product) {
        String categoryName = categoryService.findCategoryById(product.getCategoryId()).getName();
        return new ProductDTO(
                product.getId(), product.getName(), product.getCode(), product.getDescription(),
                product.getUnitMeasurement(), product.getStock(), product.getSalePrice(),
                categoryName, product.getStatus()
        );
    }

    private Product convertToEntity(ProductDTO productDto) {
        Long categoryId = categoryService.findIdByName(productDto.getCategoryName());
        if (categoryId == null) {
            throw new CategoryNotFoundException("Categoría no encontrada con nombre: " + productDto.getCategoryName());
        }
        return new Product(
                productDto.getId(), productDto.getName(), productDto.getCode(), productDto.getDescription(),
                productDto.getUnitMeasurement(), productDto.getStock(), productDto.getSalePrice(),
                categoryId, productDto.getStatus()
        );
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDto) {
        logger.info("Updating product");

        Product existingProduct = productService.findProductById(id);
        if (existingProduct == null) {
            logger.warn("Product not found");
            throw new ProductNotFoundException("Producto con id " + id + " no encontrado");
        }

        if (productDto.getName() != null) {
            existingProduct.setName(productDto.getName());
        }
        if (productDto.getCode() != null) {
            existingProduct.setCode(productDto.getCode());
        }
        if (productDto.getDescription() != null) {
            existingProduct.setDescription(productDto.getDescription());
        }
        if (productDto.getUnitMeasurement() != null) {
            existingProduct.setUnitMeasurement(productDto.getUnitMeasurement());
        }
        if (productDto.getStock() != null) {
            existingProduct.setStock(productDto.getStock());
        }
        if (productDto.getSalePrice() != null){
            existingProduct.setSalePrice(productDto.getSalePrice());
        }
        if (productDto.getCategoryName() != null) {
            Long categoryId = categoryService.findIdByName(productDto.getCategoryName());
            if (categoryId == null) {
                throw new CategoryNotFoundException("Categoría no encontrada con nombre: " + productDto.getCategoryName());
            }
            existingProduct.setCategoryId(categoryId);
        }
        if (productDto.getStatus() != null) {
            existingProduct.setStatus(productDto.getStatus());
        }

        if (existingProduct.getStock() == 0) {
            existingProduct.setStatus(Product.Status.OUT_OF_STOCK);
        } else {
            existingProduct.setStatus(Product.Status.ACTIVE);
        }
        
        Product updatedProduct = productService.updateProduct(existingProduct);
        logger.info("Product updated");
        return convertToDto(updatedProduct);
    }


    public List<ProductDTO> findProductsByName(String name, int page, int size) {
        Page<Product> productPage = productService.findProductsByName(name, page, size);
        return productPage.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<ProductDTO> findProductsByStatus(Product.Status status, int page, int size) {
        Page<Product> productPage = productService.findProductsByStatus(status, page, size);
        return productPage.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<ProductDTO> findProductsByCategoryName(String categoryName, int page, int size) {
        Page<Product> productPage = productService.findProductsByCategoryName(categoryName, page, size);
        return productPage.stream().map(this::convertToDto).collect(Collectors.toList());
    }
}
