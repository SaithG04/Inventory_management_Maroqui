package ucv.app_inventory.order_service.infrastructure.outbound.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import ucv.app_inventory.order_service.application.dto.SupplierDTO;

/**
 * Feign client for interacting with the external Supplier service.
 * Allows retrieving supplier information by supplier ID.
 */
@FeignClient(name = "supplier-service", url = "${supplier.service.url}")
public interface SupplierAPIClient {

    /**
     * Fetches supplier information by supplier ID from the Supplier service.
     *
     * @param id The ID of the supplier to retrieve.
     * @return A SupplierDTO containing supplier details.
     */
    @GetMapping("/api/supplier/findById/{id}")
    SupplierDTO getSupplierById(@PathVariable("id") Long id);

    @GetMapping("/api/supplier/findByName")
    Page<SupplierDTO> getSupplierByName(@RequestParam String name, Pageable pageable);
}
