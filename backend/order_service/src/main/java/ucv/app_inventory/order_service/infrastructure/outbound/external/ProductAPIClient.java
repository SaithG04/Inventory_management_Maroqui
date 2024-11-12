package ucv.app_inventory.order_service.infrastructure.outbound.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ucv.app_inventory.order_service.application.dto.ProductDTO;

/**
 * Feign client for interacting with the external Product service.
 * Allows retrieving product information by product ID.
 */
@FeignClient(name = "product-service", url = "${product.service.url}")
public interface ProductAPIClient {

    /**
     * Fetches product information by product ID from the Product service.
     *
     * @param id The ID of the product to retrieve.
     * @return A ProductDTO containing product details.
     */
    @GetMapping("/api/products/{id}")
    ProductDTO getProductById(@PathVariable("id") Long id);
}