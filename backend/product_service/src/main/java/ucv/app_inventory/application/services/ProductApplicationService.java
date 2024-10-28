package ucv.app_inventory.application.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import ucv.app_inventory.application.DTO.ProductDTO;
import ucv.app_inventory.domain.entities.Product;

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

        Page<Product> productsPage = productService.listProducts(page, size);
        return productsPage.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public ProductDTO saveProduct(ProductDTO productDto) {
        Product product = convertToEntity(productDto);
        Product savedProduct = productService.saveProduct(product);
        return convertToDto(savedProduct);
    }

    public void deleteProduct(Long id) {
        productService.deleteProduct(id);
    }

    public ProductDTO findProductById(Long id) {
        Product product = productService.findProductById(id);
        if (product == null) {
            // Manejar el caso en que el producto no se encuentra, por ejemplo lanzando una excepción custom
            throw new RuntimeException("El producto con id " + id + " no existe");
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
        Product existingProduct = productService.findProductById(id);


        existingProduct.setName(productDto.getName());
        existingProduct.setCode(productDto.getCode());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setUnitMeasurement(productDto.getUnitMeasurement());
        existingProduct.setStock(productDto.getStock());
        existingProduct.setCategoryId(productDto.getCategoryId());
        existingProduct.setStatus(productDto.getStatus());


        Product updatedProduct = productService.saveProduct(existingProduct);
        return convertToDto(updatedProduct);
    }

    public List<ProductDTO> findProductsByName(String name) {
        List<Product> products = productService.findProductsByName(name);
        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<ProductDTO> findProductsByStatus(Product.Status status) {
        List<Product> products = productService.findProductsByStatus(status);
        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<ProductDTO> findProductsByCategoryName(String categoryName) {
        List<Product> products = productService.findProductsByCategoryName(categoryName);
        return products.stream().map(this::convertToDto).collect(Collectors.toList());
    }

}
