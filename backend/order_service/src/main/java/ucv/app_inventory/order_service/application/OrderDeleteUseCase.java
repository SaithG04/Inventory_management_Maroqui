package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidStateException;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

@Service
@RequiredArgsConstructor
public class OrderDeleteUseCase {

    private static final Logger logger = LoggerFactory.getLogger(OrderDeleteUseCase.class);

    private final OrderMySqlRepository orderMySqlRepository;

    /**
     * Deletes an order by its ID if it exists.
     * Throws an exception if the order is not found.
     *
     * @param order the order to be deleted.
     */
    @Transactional
    public void deleteOrder(Order order) {

        Long id = order.getId();

        // Validation to check if the order is in a valid state for deletion
        if (order.getStatus() == OrderState.PENDING) {
            throw new InvalidStateException("Cannot delete a pending order.");
        }

        try {
            // Delete the order from the repository
            orderMySqlRepository.deleteById(id);

            // Log the deletion for auditing purposes
            logger.info("Order with ID {} has been deleted.", id);
        } catch (Exception e) {
            // Log and rethrow any unexpected exception to ensure consistency
            logger.error("Error occurred while deleting order with ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to delete order with ID " + id, e);
        }
    }
}
