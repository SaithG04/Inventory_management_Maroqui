package ucv.app_inventory.application.services;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import ucv.app_inventory.application.DTO.ProductDTO;
import ucv.app_inventory.domain.entities.Product;

import java.util.List;

@Service
@Component
public class ProductApplicationService {
    private final ProductService productService;

    public ProductApplicationService(ProductService productService) {
        this.productService = productService;
    }

    public List<ProductDTO> listProducts() {
        List<Product> products = productService.listProducts();
        return products.stream().map(this::convertToDto).toList();
    }

    public ProductDTO saveProduct(ProductDTO productDto) {
        Product product = convertToEntity(productDto);
        Product savedProduct = productService.saveProduct(product);
        return convertToDto(savedProduct);
    }

    public void deleteProduct(Integer id) {
        productService.deleteProduct(id);
    }

    public ProductDTO findProductById(Integer id) {
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
                product.getCostPrice(), product.getUnitMeasurement(), product.getStock()
                , product.getCategoryId(), product.getSupplierId()
        );
    }

    private Product convertToEntity(ProductDTO productDto) {
        return new Product(
                productDto.getId(), productDto.getName(), productDto.getCode(), productDto.getDescription(),
                productDto.getCostPrice(), productDto.getUnitMeasurement(), productDto.getStock()
                , productDto.getCategoryId(), productDto.getSupplierId()
        );
    }

    public ProductDTO updateProduct(Integer id, ProductDTO productDto) {
        Product existingProduct = productService.findProductById(id);


        existingProduct.setName(productDto.getName());
        existingProduct.setCode(productDto.getCode());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setCostPrice(productDto.getCostPrice());
        existingProduct.setUnitMeasurement(productDto.getUnitMeasurement());
        existingProduct.setStock(productDto.getStock());
        existingProduct.setCategoryId(productDto.getCategoryId());
        existingProduct.setSupplierId(productDto.getSupplierId());


        Product updatedProduct = productService.saveProduct(existingProduct);
        return convertToDto(updatedProduct);
    }

}
