package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailFindUseCase {

    private final OrderDetailMySqlRepository orderDetailRepository;

    public List<OrderDetail> findByOrderId(Long orderId) {
        return orderDetailRepository.findByOrderId(orderId);
    }
}
