package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

@Service
@RequiredArgsConstructor
public class OrderDeleteUseCase {

    private final OrderMySqlRepository orderMySqlRepository;

    @Transactional
    public void eliminarPedido(Long id) {
        orderMySqlRepository.deleteById(id);
    }
}
