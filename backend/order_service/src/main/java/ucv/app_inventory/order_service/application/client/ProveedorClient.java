package ucv.app_inventory.order_service.application.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ucv.app_inventory.order_service.application.dto.ProveedorDTO;

@FeignClient(name = "provider-service", url = "${provider.service.url}")
public interface ProveedorClient {

    @GetMapping("/api/proveedores/{id}")
    ProveedorDTO getProviderById(@PathVariable("id") Long id);
}
