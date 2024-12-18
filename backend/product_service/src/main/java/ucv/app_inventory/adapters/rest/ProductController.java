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
import ucv.app_inventory.exception.ProductNotFoundException;

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
        logger.info("Listing products");
        List<ProductDTO> products = productApplicationService.listProducts(page, size);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/saveProduct")
    public ResponseEntity<ProductDTO> saveProduct(@RequestBody ProductDTO productDto) {
        logger.info("Saving product");
        ProductDTO savedProduct = productApplicationService.saveProduct(productDto);
        logger.info("Product saved");
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDto) {
        logger.info("Updating product with id");
        ProductDTO updatedProduct = productApplicationService.updateProduct(id, productDto);
        logger.info("Product updated");
        return ResponseEntity.ok(updatedProduct);
    }


    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        logger.info("Deleting product");
        productApplicationService.deleteProduct(id);
        logger.info("Product deleted");
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/findProductById/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable(value = "id") final Long id) {
        logger.info("Buscando producto por id: {}", id);
        try {
            ProductDTO productDto = productApplicationService.findProductById(id);
            return ResponseEntity.ok(productDto);
        } catch (ProductNotFoundException e) {
            logger.warn("Producto no encontrado con id: {}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Error interno: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findByName")
    public ResponseEntity<List<ProductDTO>> findByName(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        List<ProductDTO> products = productApplicationService.findProductsByName(name, page, size);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/findByStatus")
    public ResponseEntity<List<ProductDTO>> findByStatus(
            @RequestParam Product.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        List<ProductDTO> products = productApplicationService.findProductsByStatus(status, page, size);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/findByCategoryName")
    public ResponseEntity<List<ProductDTO>> findByCategoryName(
            @RequestParam String categoryName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        List<ProductDTO> products = productApplicationService.findProductsByCategoryName(categoryName, page, size);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

}


