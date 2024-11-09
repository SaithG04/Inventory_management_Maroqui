package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.order_service.application.dto.ProductDTO;
import ucv.app_inventory.order_service.application.dto.ProviderDTO;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProductAPIClient;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProviderAPIClient;

@Service
@RequiredArgsConstructor
public class OrderCreateUseCase {

    private final OrderMySqlRepository orderMySqlRepository;
    private final ProviderAPIClient providerAPIClient;
    private final ProductAPIClient productClient;

    @Transactional
    public Order crearPedido(Order order) {
        return orderMySqlRepository.save(order);
    }

    public ProviderDTO obtenerProveedor(Long proveedorId) {
        return providerAPIClient.getProviderById(proveedorId);
    }

    public ProductDTO obtenerProducto(Long productoId) {
        return productClient.getProductById(productoId);
    }

}
