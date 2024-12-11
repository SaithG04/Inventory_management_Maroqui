package ucv.app_inventory.order_service.infrastructure.outbound.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import ucv.app_inventory.order_service.application.dto.ProductDTO;

import java.util.List;

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
    @GetMapping("/api/products/findProductById/{id}")
    ProductDTO getProductById(@PathVariable("id") Long id);

    /**
     * Fetches products by name with pagination support.
     *
     * @param name The name of the product to search for.
     * @param page The page number (default 0).
     * @param size The number of products per page (default 15).
     * @return A list of ProductDTOs containing product details.
     */
    @GetMapping("/api/product/findByName")
    List<ProductDTO> getProductsByName(
            @RequestParam("name") String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size);
}