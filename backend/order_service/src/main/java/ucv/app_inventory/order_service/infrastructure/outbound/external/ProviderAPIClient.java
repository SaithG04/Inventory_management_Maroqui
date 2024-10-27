package ucv.app_inventory.order_service.infrastructure.outbound.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ucv.app_inventory.order_service.application.dto.ProviderDTO;

@FeignClient(name = "provider-service", url = "${provider.service.url}")
public interface ProviderAPIClient {

    @GetMapping("/api/proveedores/{id}")
    ProviderDTO getProviderById(@PathVariable("id") Long id);
}
