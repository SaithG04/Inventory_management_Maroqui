package ucv.app_inventory.adapters.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.application.DTO.ProductDTO;
import ucv.app_inventory.application.services.ProductApplicationService;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductApplicationService productApplicationService;

    @GetMapping("/listProducts")
    public ResponseEntity<List<ProductDTO>> listProduct() {
        List<ProductDTO> products = productApplicationService.listProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/saveProduct")
    public ResponseEntity<ProductDTO> saveProduct(@RequestBody ProductDTO productDto) {
        ProductDTO savedProduct = productApplicationService.saveProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Integer id, @RequestBody ProductDTO productDto) {
        ProductDTO updatedProduct = productApplicationService.updateProduct(id, productDto);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productApplicationService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/findProductById/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable(value = "id") final Integer id) {
        try {
            ProductDTO productDto = productApplicationService.findProductById(id);
            if (productDto == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(productDto);
        } catch (Exception e) {
            e.printStackTrace();  // Para ver detalles del error en la consola
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}


