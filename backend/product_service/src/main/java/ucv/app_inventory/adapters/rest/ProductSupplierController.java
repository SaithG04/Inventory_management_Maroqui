package ucv.app_inventory.adapters.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.application.DTO.ProductSupplierDTO;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.application.services.ProductSupplierService;
import ucv.app_inventory.adapters.outbounds.SupplierClient;

import java.util.List;

@RestController
@RequestMapping("/api/product-supplier")
@RequiredArgsConstructor
public class ProductSupplierController {

    private final ProductSupplierService productSupplierService;
    private final SupplierClient supplierClient;  // Cliente Feign para llamar al microservicio de proveedores

    // Obtener los proveedores por ID de producto
    @GetMapping("/{productId}/suppliers")
    public ResponseEntity<List<SupplierDTO>> getSuppliersByProductId(@PathVariable Long productId) {
        List<SupplierDTO> suppliers = productSupplierService.getSuppliersByProductId(productId);

        // Si no se encuentran proveedores, devolver código de respuesta 204 No Content
        return suppliers.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(suppliers);
    }

    // Agregar un proveedor a un producto
    @PostMapping("/{productId}/suppliers/{supplierId}")
    public ResponseEntity<Void> addSupplierToProduct(@PathVariable Long productId, @PathVariable Long supplierId,
                                                     @RequestBody ProductSupplierDTO request) {
        // Llamada al microservicio de proveedores a través del cliente Feign para obtener el proveedor por ID
        SupplierDTO supplier = supplierClient.getSupplierById(supplierId); // Esto usa Feign para llamar al microservicio de proveedores

        // Si no se encuentra el proveedor, devolver 404 Not Found
        if (supplier == null) {
            return ResponseEntity.notFound().build();
        }

        // Aquí añadimos la lógica para agregar la relación en la base de datos, usando ProductSupplierService
        productSupplierService.addSupplierToProduct(productId, supplierId, request.getPrice());
        return ResponseEntity.ok().build();
    }

    // Eliminar un proveedor de un producto
    @DeleteMapping("/{productId}/suppliers/{supplierId}")
    public ResponseEntity<Void> removeSupplierFromProduct(@PathVariable Long productId, @PathVariable Long supplierId) {
        // Llamada al microservicio de proveedores a través del cliente Feign para verificar si el proveedor existe
        SupplierDTO supplier = supplierClient.getSupplierById(supplierId);

        // Si no se encuentra el proveedor, devolver 404 Not Found
        if (supplier == null) {
            return ResponseEntity.notFound().build();
        }

        // Lógica para eliminar la relación entre el proveedor y el producto
        productSupplierService.removeSupplierFromProduct(productId, supplierId);
        return ResponseEntity.noContent().build();
    }
}