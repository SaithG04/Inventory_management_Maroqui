package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

@Service
@RequiredArgsConstructor
public class OrderDeleteUseCase {

    private final OrderMySqlRepository orderMySqlRepository;

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderMySqlRepository.existsById(id)) {
            throw new OrderNotFoundException("Order with ID " + id + " not found");
        }
        orderMySqlRepository.deleteById(id); // Esto debería eliminar también los detalles si tienes cascade delete configurado
    }
}
