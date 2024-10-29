package ucv.app_inventory.adapters.rest;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.application.DTO.ProductDTO;
import ucv.app_inventory.application.services.ProductApplicationService;
import ucv.app_inventory.domain.entities.Product;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductApplicationService productApplicationService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @GetMapping("/listProducts")
    public ResponseEntity<List<ProductDTO>> listProduct(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        logger.info("Listing products with page: {}, size: {}", page, size);
        List<ProductDTO> products = productApplicationService.listProducts(page, size);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/saveProduct")
    public ResponseEntity<ProductDTO> saveProduct(@RequestBody ProductDTO productDto) {
        logger.info("Saving product: {}", productDto);
        ProductDTO savedProduct = productApplicationService.saveProduct(productDto);
        logger.info("Product saved: {}", savedProduct);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDto) {
        logger.info("Updating product with id: {}", id);
        ProductDTO updatedProduct = productApplicationService.updateProduct(id, productDto);
        logger.info("Product updated: {}", updatedProduct);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        logger.info("Deleting product with id: {}", id);
        productApplicationService.deleteProduct(id);
        logger.info("Product deleted with id: {}", id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/findProductById/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable(value = "id") final Long id) {
        logger.info("Finding product by id: {}", id);
        try {
            ProductDTO productDto = productApplicationService.findProductById(id);
            if (productDto == null) {
                logger.warn("Product not found with id: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(productDto);
        } catch (Exception e) {
            logger.error("Error finding product by id: {}", id, e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/findByName")
    public ResponseEntity<List<ProductDTO>> findByName(@RequestParam String name) {
        logger.info("Finding products by name: {}", name);
        List<ProductDTO> products = productApplicationService.findProductsByName(name);
        if (products.isEmpty()) {
            logger.info("No products found with name: {}", name);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/findByStatus")
    public ResponseEntity<List<ProductDTO>> findByStatus(@RequestParam Product.Status status) {
        logger.info("Finding products by status: {}", status);
        List<ProductDTO> products = productApplicationService.findProductsByStatus(status);
        if (products.isEmpty()) {
            logger.info("No products found with status: {}", status);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/findByCategoryName")
    public ResponseEntity<List<ProductDTO>> findByCategoryName(@RequestParam String categoryName) {
        logger.info("Finding products by category name: {}", categoryName);
        List<ProductDTO> products = productApplicationService.findProductsByCategoryName(categoryName);
        if (products.isEmpty()) {
            logger.info("No products found with category name: {}", categoryName);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

}


