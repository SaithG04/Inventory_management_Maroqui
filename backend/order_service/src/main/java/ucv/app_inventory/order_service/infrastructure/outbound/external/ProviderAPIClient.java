package ucv.app_inventory.order_service.infrastructure.outbound.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ucv.app_inventory.order_service.application.dto.ProviderDTO;

/**
 * Feign client for interacting with the external Provider service.
 * Allows retrieving provider information by provider ID.
 */
@FeignClient(name = "provider-service", url = "${provider.service.url}")
public interface ProviderAPIClient {

    /**
     * Fetches provider information by provider ID from the Provider service.
     *
     * @param id The ID of the provider to retrieve.
     * @return A ProviderDTO containing provider details.
     */
    @GetMapping("/api/providers/{id}")
    ProviderDTO getProviderById(@PathVariable("id") Long id);
}
