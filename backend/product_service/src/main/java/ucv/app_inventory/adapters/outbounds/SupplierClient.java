package ucv.app_inventory.adapters.outbounds;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ucv.app_inventory.application.DTO.SupplierDTO;

import java.util.List;

@FeignClient(name = "supplier-service", url = "${supplier.service.url}")
public interface SupplierClient {
    @GetMapping("/api/supplier/getById/{supplierId}")
    SupplierDTO getSupplierById(@PathVariable("supplierId") Long supplierId);

    @GetMapping("/product/{productId}")
    List<SupplierDTO> getSuppliersByProductId(@PathVariable("productId") Long productId);
}