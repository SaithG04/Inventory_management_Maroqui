package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderDetailFindUseCase {

    private final OrderDetailMySqlRepository orderDetailRepository;

    public Optional<OrderDetail> findById(Long orderId) {
        return orderDetailRepository.findById(orderId);
    }
}
