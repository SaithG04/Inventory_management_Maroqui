package ucv.app_inventory.adapters.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.application.DTO.ProductSupplierDTO;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.application.services.ProductSupplierService;
import ucv.app_inventory.domain.entities.ProductSupplier;

import java.util.List;

@RestController
@RequestMapping("/api/product-supplier")
@RequiredArgsConstructor
public class ProductSupplierController {

    private final ProductSupplierService productSupplierService;

    // Obtener los proveedores por ID de producto
    @GetMapping("/{productId}/suppliers")
    public ResponseEntity<List<SupplierDTO>> getSuppliersByProductId(@PathVariable Long productId) {
        List<SupplierDTO> suppliers = productSupplierService.getSuppliersByProductId(productId);

        // Si no se encuentran proveedores, devolver código de respuesta 204 No Content
        return suppliers.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(suppliers);
    }

    // Agregar un proveedor a un producto
    @PostMapping("/addSupplierToProduct")
    public ResponseEntity<ProductSupplier> addSupplierToProduct(@RequestBody ProductSupplierDTO request) {
        // Aquí añadimos la lógica para agregar la relación en la base de datos, usando ProductSupplierService
        ProductSupplier productSupplier = productSupplierService.addSupplierToProduct(request);
        return ResponseEntity.ok().body(productSupplier);
    }

    @DeleteMapping("/deleteRelationById/{id}")
    public ResponseEntity<Void> deleteRelationById(@PathVariable Long id) {
        productSupplierService.removeRelationsById(id);
        return ResponseEntity.noContent().build();
    }

    // Eliminar un proveedor de un producto
    @DeleteMapping("/{productId}/supplier")
    public ResponseEntity<Void> removeSupplierFromProduct(@PathVariable Long productId, @RequestParam String supplierName) {
        // Lógica para eliminar la relación entre el proveedor y el producto
        productSupplierService.removeSupplierFromProduct(productId, supplierName);
        return ResponseEntity.noContent().build();
    }

    // Obtener todas las relaciones por nombre del proveedor
    @GetMapping("/supplier/{supplierName}")
    public ResponseEntity<List<ProductSupplier>> getRelationsBySupplierId(@PathVariable String supplierName) {
        List<ProductSupplier> relations = productSupplierService.getRelationsBySupplierName(supplierName);
        return relations.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(relations);
    }

    // Verificar si existe una relación entre un producto y un proveedor
    @GetMapping("/{productId}/suppliers/{supplierId}/exists")
    public ResponseEntity<Boolean> checkRelationExists(@PathVariable Long productId, @PathVariable Long supplierId) {
        boolean exists = productSupplierService.existsByProductAndSupplier(productId, supplierId);
        return ResponseEntity.ok(exists);
    }

    // Buscar una relación por ID del producto y proveedor
    @GetMapping("/{productId}/suppliers/{supplierId}")
    public ResponseEntity<ProductSupplier> getRelationByProductAndSupplier(
            @PathVariable Long productId, @PathVariable Long supplierId) {
        ProductSupplier relation = productSupplierService.getRelationByProductAndSupplier(productId, supplierId);
        return relation == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(relation);
    }

    // Obtener por ID
    @GetMapping("/findById/{id}")
    public ResponseEntity<ProductSupplier> getById(@PathVariable Long id) {
        ProductSupplier productSupplier = productSupplierService.getById(id);
        return productSupplier == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(productSupplier);
    }

}