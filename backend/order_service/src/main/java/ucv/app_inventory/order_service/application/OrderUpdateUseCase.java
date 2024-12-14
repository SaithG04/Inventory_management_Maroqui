package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.order_service.application.dto.OrderDTO;
import ucv.app_inventory.order_service.application.dto.mappers.OrderMapper;
import ucv.app_inventory.order_service.application.dto.SupplierDTO;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.*;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.SupplierAPIClient;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import static ucv.app_inventory.order_service.application.OrderCreateUseCase.validateOrderDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderUpdateUseCase {

    private final OrderMySqlRepository orderMySqlRepository;
    private final OrderDetailMySqlRepository orderDetailMySqlRepository;
    private final OrderCreateUseCase orderCreateUseCase;
    private final OrderMapper orderMapper;
    private final SupplierAPIClient supplierAPIClient;
    private final Logger logger = LoggerFactory.getLogger(OrderUpdateUseCase.class);

    /**
     * Updates an order with the new information provided in the OrderDTO.
     * This method performs the following steps:
     * - Validates the state transition to ensure the change is allowed.
     * - Updates the order details (supplier, status, observations).
     * - Deletes the old order details and processes the new ones.
     * - Recalculates the total of the order and updates it.
     * - Saves the updated order and ensures the total is not zero.
     *
     * @param updatedOrder the updated order data.
     * @return the updated order.
     * @throws OrderNotFoundException          if the order is not found.
     * @throws InvalidStateTransitionException if the state transition is invalid.
     * @throws TotalCannotBeNullException      if the total of the order is zero.
     */
    @Transactional
    @CacheEvict(value = "orders")
    // Evicts the cache for the specific order to ensure the latest version is fetched.
    public Order updateOrder(Order updatedOrder) {
        return orderMySqlRepository.save(updatedOrder);
    }

    public Order validateChanges(Order oldOrder, OrderDTO updatedOrderDTO) {

        SupplierDTO supplierDTO = null;
        logger.info("Validate changes for {}", updatedOrderDTO);

        // Update supplier ID
        if(updatedOrderDTO.getSupplierName() != null && !updatedOrderDTO.getSupplierName().isEmpty()){
            logger.info("Updating supplier");
            supplierDTO = orderCreateUseCase.validateSupplier(updatedOrderDTO);
            oldOrder.setId(supplierDTO.getId());
        }

        // Update order date
        if (updatedOrderDTO.getOrderDate() != null) {
            logger.info("Updating date");
            LocalDate orderDate = validateOrderDate(updatedOrderDTO.getOrderDate());
            oldOrder.setOrderDate(orderDate);
        }

        // Update status
        if(updatedOrderDTO.getStatus() != null){
            logger.info("Updating status");
            OrderState orderState = validateStatus(updatedOrderDTO.getStatus());
            if (!isValidStateTransition(oldOrder.getStatus(), orderState)){
                throw new InvalidStateTransitionException("The state transition is not valid.");
            }
            oldOrder.setStatus(orderState);
        }

        // Update order details (when the supplier is updated)
        if (updatedOrderDTO.getOrderDetails() != null && !updatedOrderDTO.getOrderDetails().isEmpty()
                && (updatedOrderDTO.getSupplierName() != null && !updatedOrderDTO.getSupplierName().isEmpty())) {
            logger.info("Updating order details for new supplier");
            // Delete existing oldOlder details to simplify the update process
            List<OrderDetail> existingDetails = orderDetailMySqlRepository.findByOrderId(oldOrder.getId());
            orderDetailMySqlRepository.deleteAll(existingDetails);

            // Calculate the new total and save new oldOlder details using the reusable method
            double total = orderCreateUseCase.processOrderDetails(updatedOrderDTO, supplierDTO, oldOrder, orderDetailMySqlRepository);

            // Check that the total is not zero
            if (total == 0.0) {
                throw new TotalCannotBeNullException("The total cannot be zero.");
            }
            // Update the oldOlder total
            oldOrder.setTotal(total);
        }

        // Update order details (when the supplier is not updated)
        if (updatedOrderDTO.getOrderDetails() != null && !updatedOrderDTO.getOrderDetails().isEmpty()) {
            logger.info("Updating order details");
            // Delete existing oldOlder details to simplify the update process
            List<OrderDetail> existingDetails = orderDetailMySqlRepository.findByOrderId(oldOrder.getId());
            orderDetailMySqlRepository.deleteAll(existingDetails);
            SupplierDTO oldSupplierDTO = supplierAPIClient.getSupplierById(oldOrder.getSupplierId())
                    .orElseThrow(()-> new InvalidArgumentException("Supplier not found"));
            // Calculate the new total and save new oldOlder details using the reusable method
            double total = orderCreateUseCase.processOrderDetails(updatedOrderDTO, oldSupplierDTO, oldOrder, orderDetailMySqlRepository);

            // Check that the total is not zero
            if (total == 0.0) {
                throw new TotalCannotBeNullException("The total cannot be zero.");
            }
            // Update the oldOlder total
            oldOrder.setTotal(total);
        }

        // Update observations
        if (updatedOrderDTO.getObservations() != null) {
            logger.info("Updating observations");
            oldOrder.setObservations(updatedOrderDTO.getObservations());
        }

        return oldOrder;
    }

    /**
     * Validates whether a state transition is allowed based on the current and new state.
     *
     * @param currentState the current state of the order.
     * @param newState     the new state to transition to.
     * @return true if the transition is valid, false otherwise.
     */
    public boolean isValidStateTransition(OrderState currentState, OrderState newState) {
        return switch (currentState) {
            case PENDING ->
                    newState == currentState || newState == OrderState.PROCESSED || newState == OrderState.CANCELED;
            case PROCESSED -> newState == currentState || newState == OrderState.CANCELED;
            case CANCELED -> newState == currentState;
        };
    }

    private OrderState validateStatus(String status) {
        if (!status.equals("PENDING") && !status.equals("PROCESSED") && !status.equals("CANCELED")) {
            throw new InvalidArgumentException("The status is not valid.");
        }
        return OrderState.valueOf(status);
    }

}