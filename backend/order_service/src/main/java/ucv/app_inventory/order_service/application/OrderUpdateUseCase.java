package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.order_service.application.dto.OrderDTO;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidStateTransitionException;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;
import ucv.app_inventory.order_service.exception.TotalCannotBeNullException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

import java.util.List;

import static ucv.app_inventory.order_service.application.OrderCreateUseCase.processOrderDetails;

@Service
@RequiredArgsConstructor
public class OrderUpdateUseCase {

    private final OrderMySqlRepository orderMySqlRepository;
    private final OrderDetailMySqlRepository orderDetailMySqlRepository;

    @Transactional
    public Order updateOrder(Long id, OrderDTO orderDTO) {
        return orderMySqlRepository.findById(id).map(order -> {
            // Validar que la transición de estado sea válida
            if (!isValidStateTransition(order.getStatus(), OrderState.valueOf(orderDTO.getStatus()))) {
                throw new InvalidStateTransitionException("La transición de estado no es válida.");
            }

            // Actualiza los datos básicos de la orden
            order.setSupplierId(orderDTO.getSupplierId());
            order.setStatus(OrderState.valueOf(orderDTO.getStatus()));
            order.setObservations(orderDTO.getObservations());

            // Eliminar detalles anteriores para simplificar la actualización
            List<OrderDetail> existingDetails = orderDetailMySqlRepository.findByOrderId(order.getId());
            orderDetailMySqlRepository.deleteAll(existingDetails);

            // Calcula el total y guarda los nuevos detalles del pedido utilizando el método reutilizable
            double total = processOrderDetails(orderDTO, order, orderDetailMySqlRepository);

            // Actualiza el total de la orden
            order.setTotal(total);

            // Guarda la orden con el total actualizado
            order = orderMySqlRepository.save(order);

            // Verificar que el total no sea 0
            if (order.getTotal() == 0.0) {
                throw new TotalCannotBeNullException("El total no puede ser cero.");
            }

            return order;
        }).orElseThrow(() -> new OrderNotFoundException("Order with ID " + id + " not found"));
    }

    public boolean isValidStateTransition(OrderState currentState, OrderState newState) {
        return switch (currentState) {
            case PENDING -> newState == OrderState.PROCESSED || newState == OrderState.CANCELED;
            case PROCESSED -> newState == OrderState.CANCELED;
            case CANCELED -> false;
            default -> false;
        };
    }

}
