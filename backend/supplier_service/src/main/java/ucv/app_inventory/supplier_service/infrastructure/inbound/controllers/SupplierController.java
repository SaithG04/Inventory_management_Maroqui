package ucv.app_inventory.supplier_service.infrastructure.inbound.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.supplier_service.application.SupplierFindUseCase;
import ucv.app_inventory.supplier_service.application.SupplierCreateUseCase;
import ucv.app_inventory.supplier_service.application.SupplierUpdateUseCase;
import ucv.app_inventory.supplier_service.application.SupplierDeleteUseCase;
import ucv.app_inventory.supplier_service.application.dto.SupplierDTO;
import ucv.app_inventory.supplier_service.domain.model.Supplier;
import ucv.app_inventory.supplier_service.domain.model.SupplierState;

import java.util.Optional;

@RestController
@RequestMapping("/api/supplier")
public class SupplierController {

    private final SupplierFindUseCase supplierFindUseCase;
    private final SupplierCreateUseCase supplierCreateUseCase;
    private final SupplierUpdateUseCase supplierUpdateUseCase;
    private final SupplierDeleteUseCase supplierDeleteUseCase;

    @Autowired
    public SupplierController(SupplierFindUseCase supplierFindUseCase, SupplierCreateUseCase supplierCreateUseCase,
                              SupplierUpdateUseCase supplierUpdateUseCase, SupplierDeleteUseCase supplierDeleteUseCase) {
        this.supplierFindUseCase = supplierFindUseCase;
        this.supplierCreateUseCase = supplierCreateUseCase;
        this.supplierUpdateUseCase = supplierUpdateUseCase;
        this.supplierDeleteUseCase = supplierDeleteUseCase;
    }

    @GetMapping("/findByStatus")
    public Page<Supplier> findSuppliersByStatus(@RequestParam SupplierState status, Pageable pageable) {
        return supplierFindUseCase.findSuppliersByStatus(status, pageable);
    }

    @GetMapping("/findByName")
    public Page<Supplier> findSuppliersByName(@RequestParam String name, Pageable pageable) {
        return supplierFindUseCase.findSuppliersByName(name, pageable);
    }

    @GetMapping("/listAll")
    public Page<Supplier> findAll(Pageable pageable) {
        return supplierFindUseCase.listAll(pageable);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Supplier> findById(@PathVariable Long id) {
        Optional<Supplier> supplier = supplierFindUseCase.findById(id);
        return supplier.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Supplier> createSupplier(@Valid @RequestBody SupplierDTO orderDTO) {
        Supplier createdSupplier = supplierCreateUseCase.createSupplier(orderDTO);
        return ResponseEntity.ok(createdSupplier);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody SupplierDTO orderDTO) {
        Supplier updatedSupplier = supplierUpdateUseCase.updateSupplier(id, orderDTO);
        return ResponseEntity.ok(updatedSupplier);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        Supplier supplier = supplierFindUseCase.findById(id).orElse(null);
        if(supplier == null) {
            return ResponseEntity.notFound().build();
        }else {
            supplierDeleteUseCase.deleteSupplier(supplier);
            return ResponseEntity.noContent().build();
        }
    }

}
