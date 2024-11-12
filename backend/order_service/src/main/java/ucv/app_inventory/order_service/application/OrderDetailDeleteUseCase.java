package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;

@Service
@RequiredArgsConstructor
public class OrderDetailDeleteUseCase {

    private final OrderDetailMySqlRepository orderDetailRepository;

    public void deleteOrderDetail(Long id) {
        if (!orderDetailRepository.existsById(id)) {
            throw new OrderNotFoundException("OrderDetail with ID " + id + " not found");
        }
        orderDetailRepository.deleteById(id);
    }
}