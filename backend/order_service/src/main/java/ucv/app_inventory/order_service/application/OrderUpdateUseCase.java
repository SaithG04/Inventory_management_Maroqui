package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

@Service
@RequiredArgsConstructor
public class OrderUpdateUseCase {

    private final OrderMySqlRepository orderMySqlRepository;

    public Order actualizarPedido(Order order) {
        return orderMySqlRepository.save(order);
    }
}
