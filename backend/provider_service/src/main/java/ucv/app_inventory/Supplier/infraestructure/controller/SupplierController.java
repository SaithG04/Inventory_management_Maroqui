package ucv.app_inventory.Supplier.infraestructure.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.Supplier.application.SupplierServiceImpl;
import ucv.app_inventory.Supplier.domain.Supplier;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierServiceImpl supplierServiceImpl;

    // Add supplier
    @PostMapping
    public ResponseEntity<Supplier> addSupplier(@RequestBody Supplier supplier) {
        Supplier newSupplier = supplierServiceImpl.addSupplier(supplier);
        return ResponseEntity.ok(newSupplier);
    }

    // Get all suppliers
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierServiceImpl.getAllSuppliers());
    }

    // Get supplier by ID
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        Optional<Supplier> supplier = supplierServiceImpl.getSupplierById(id);
        return supplier.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update supplier
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        Supplier updatedSupplier = supplierServiceImpl.updateSupplier(id, supplier);
        return ResponseEntity.ok(updatedSupplier);
    }

    // Delete supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierServiceImpl.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }

    // Search supplier by ID
    @GetMapping("/searchById")
    public ResponseEntity<Supplier> searchSupplierById(@RequestParam Long idSupplier) {
        Optional<Supplier> supplier = supplierServiceImpl.getSupplierById(idSupplier);
        return supplier.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
