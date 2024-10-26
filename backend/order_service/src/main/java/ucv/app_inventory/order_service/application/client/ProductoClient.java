package ucv.app_inventory.order_service.application.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ucv.app_inventory.order_service.application.dto.ProductoDTO;

@FeignClient(name = "producto-service", url = "http://localhost:8082") // Cambia la URL según sea necesario
public interface ProductoClient {

    @GetMapping("/api/productos/{id}")
    ProductoDTO getProductById(@PathVariable("id") Long id);
}
