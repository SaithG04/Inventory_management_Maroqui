package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.order_service.application.dto.OrderDTO;
import ucv.app_inventory.order_service.application.dto.SupplierDTO;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidStateTransitionException;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;
import ucv.app_inventory.order_service.exception.TotalCannotBeNullException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

import java.time.LocalDate;
import java.util.List;


@Service
@RequiredArgsConstructor
public class OrderUpdateUseCase {

    private final OrderMySqlRepository orderMySqlRepository;
    private final OrderDetailMySqlRepository orderDetailMySqlRepository;
    private final OrderCreateUseCase orderCreateUseCase;

    /**
     * Updates an order with the new information provided in the OrderDTO.
     * This method performs the following steps:
     * - Validates the state transition to ensure the change is allowed.
     * - Updates the order details (supplier, status, observations).
     * - Deletes the old order details and processes the new ones.
     * - Recalculates the total of the order and updates it.
     * - Saves the updated order and ensures the total is not zero.
     *
     * @param id the ID of the order to update.
     * @param orderDTO the updated order data.
     * @return the updated order.
     * @throws OrderNotFoundException if the order is not found.
     * @throws InvalidStateTransitionException if the state transition is invalid.
     * @throws TotalCannotBeNullException if the total of the order is zero.
     */
    @Transactional
    @CacheEvict(value = "orders", key = "#id") // Evicts the cache for the specific order to ensure the latest version is fetched.
    public Order updateOrder(Long id, OrderDTO orderDTO) {
        return orderMySqlRepository.findById(id).map(order -> {
            // Validate that the state transition is valid
            if (!isValidStateTransition(order.getStatus(), OrderState.valueOf(orderDTO.getStatus()))) {
                throw new InvalidStateTransitionException("The state transition is not valid.");
            }

            orderCreateUseCase.validateOrderDate(orderDTO);
            SupplierDTO supplierDTO = orderCreateUseCase.validateSupplier(orderDTO);

            // Update basic order data
            order.setSupplierId(supplierDTO.getId());
            order.setStatus(OrderState.valueOf(orderDTO.getStatus()));
            order.setObservations(orderDTO.getObservations());

            // Delete existing order details to simplify the update process
            List<OrderDetail> existingDetails = orderDetailMySqlRepository.findByOrderId(order.getId());
            orderDetailMySqlRepository.deleteAll(existingDetails);

            // Calculate the new total and save new order details using the reusable method
            double total = orderCreateUseCase.processOrderDetails(orderDTO, order, orderDetailMySqlRepository);

            // Update the order total
            order.setTotal(total);

            // Save the updated order with the new total
            order = orderMySqlRepository.save(order);

            // Check that the total is not zero
            if (order.getTotal() == 0.0) {
                throw new TotalCannotBeNullException("The total cannot be zero.");
            }

            return order;
        }).orElseThrow(() -> new OrderNotFoundException("Order with ID " + id + " not found"));
    }

    /**
     * Validates whether a state transition is allowed based on the current and new state.
     * @param currentState the current state of the order.
     * @param newState the new state to transition to.
     * @return true if the transition is valid, false otherwise.
     */
    public boolean isValidStateTransition(OrderState currentState, OrderState newState) {
        return switch (currentState) {
            case PENDING -> newState == OrderState.PROCESSED || newState == OrderState.CANCELED;
            case PROCESSED -> newState == OrderState.CANCELED;
            case CANCELED -> false;
            default -> false;
        };
    }

}