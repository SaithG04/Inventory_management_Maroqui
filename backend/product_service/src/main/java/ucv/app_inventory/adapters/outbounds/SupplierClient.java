package ucv.app_inventory.adapters.outbounds;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import ucv.app_inventory.application.DTO.SupplierDTO;


@FeignClient(name = "supplier-service", url = "${supplier.service.url}")
public interface SupplierClient {
    @GetMapping("/api/supplier/getById/{supplierId}")
    SupplierDTO getSupplierById(@PathVariable("supplierId") Long supplierId);

    // Buscar proveedores por nombre
    @GetMapping("/api/supplier/findByName")
    Page<SupplierDTO> getSuppliersByName(@RequestParam("name") String name, Pageable pageable);

    // @GetMapping("/product/{productId}")
    // List<SupplierDTO> getSuppliersByProductId(@PathVariable("productId") Long productId);
}