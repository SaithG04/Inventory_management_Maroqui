package ucv.app_inventory.supplier_service.infrastructure.inbound.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.supplier_service.application.ProductSupplierFindUseCase;
import ucv.app_inventory.supplier_service.application.dto.ProductSupplierDTO;

import java.util.List;

@RestController
@RequestMapping("/api/product-supplier")
@RequiredArgsConstructor
public class ProductSupplierController {

    private final ProductSupplierFindUseCase productSupplierFindUseCase;

    // Obtener los productos por ID de proveedor
    @GetMapping("/{supplierId}/products")
    public ResponseEntity<List<ProductSupplierDTO>> findBySupplierId(@PathVariable Long supplierId,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        // Obtener la página de productos desde el servicio
        Page<ProductSupplierDTO> productPage = productSupplierFindUseCase.findBySupplierId(supplierId, PageRequest.of(page, size));

        // Si no se encuentran productos, devolver código de respuesta 204 No Content
        return productPage.hasContent()
                ? ResponseEntity.ok(productPage.getContent())
                : ResponseEntity.noContent().build();
    }


}