package ucv.app_inventory.order_service.infrastructure.outbound.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ucv.app_inventory.order_service.application.dto.ProductDTO;

@FeignClient(name = "producto-service", url = "http://localhost:8082") // Cambia la URL según sea necesario
public interface ProductAPIClient {

    @GetMapping("/api/productos/{id}")
    ProductDTO getProductById(@PathVariable("id") Long id);
}
