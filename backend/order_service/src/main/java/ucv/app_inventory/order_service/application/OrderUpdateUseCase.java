package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.order_service.application.dto.OrderDTO;
import ucv.app_inventory.order_service.application.dto.OrderDetailDTO;
import ucv.app_inventory.order_service.application.dto.OrderRequestDTO;
import ucv.app_inventory.order_service.application.dto.mappers.OrderMapper;
import ucv.app_inventory.order_service.application.dto.SupplierDTO;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.*;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.SupplierAPIClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static ucv.app_inventory.order_service.application.OrderCreateUseCase.validateOrderDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderUpdateUseCase {

    private final OrderMySqlRepository orderMySqlRepository;
    private final OrderDetailMySqlRepository orderDetailMySqlRepository;
    private final OrderCreateUseCase orderCreateUseCase;
    private final OrderFindUseCase orderFindUseCase;
    private final SupplierAPIClient supplierAPIClient;
    private final OrderMapper orderMapper;
    private final Logger logger = LoggerFactory.getLogger(OrderUpdateUseCase.class);

    @Transactional
    @CacheEvict(value = "orders")
    // Evicts the cache for the specific order to ensure the latest version is fetched.
    public Order updateOrder(Long id, OrderRequestDTO orderRequestDTO) {
        OrderDTO oldOrderDTO = orderFindUseCase.findById(id);
        Order oldOrder = orderMapper.mapToOrder(oldOrderDTO);
        Order orderToUpdate = validateChanges(oldOrder, oldOrderDTO, orderRequestDTO.getOrder(), orderRequestDTO.getOrderDetails());
        return orderMySqlRepository.save(orderToUpdate);
    }

    public Order validateChanges(Order oldOrder, OrderDTO oldOrderDTO, OrderDTO newOrderDTO, List<OrderDetailDTO> orderDetailDTOList) {

        logger.info("Validating changes for {}", newOrderDTO);

        if(newOrderDTO == null) {
            throw new InvalidArgumentException("Order is required");
        }

        SupplierDTO supplierDTO = supplierAPIClient.getSupplierById(oldOrder.getSupplierId())
                .orElseThrow(() -> new SupplierNotFoundException("The supplier that was associated with this order no longer exists. Please check the supplier table."));

        // Update supplier
        if(newOrderDTO.getSupplierName() != null && !newOrderDTO.getSupplierName().isEmpty()){
            throw new InvalidArgumentException("Supplier cannot change, ignore this parameter.");
        }

        // Update order date
        if (newOrderDTO.getOrderDate() != null && !(newOrderDTO.getOrderDate().equals(oldOrderDTO.getOrderDate()))) {
            logger.info("Updating date");
            LocalDate orderDate = validateOrderDate(newOrderDTO.getOrderDate());
            oldOrder.setOrderDate(orderDate);
        }

        // Update status
        if(newOrderDTO.getStatus() != null && !(newOrderDTO.getStatus().equals(oldOrderDTO.getStatus()))) {
            logger.info("Updating status");
            OrderState orderState = validateStatus(newOrderDTO.getStatus());
            if (!isValidStateTransition(oldOrder.getStatus(), orderState)){
                throw new InvalidStateTransitionException("The state transition is not valid.");
            }
            oldOrder.setStatus(orderState);
        }

        // Update observations
        if (newOrderDTO.getObservations() != null && !(newOrderDTO.getObservations().equals(oldOrderDTO.getObservations()))) {
            logger.info("Updating observations");
            oldOrder.setObservations(newOrderDTO.getObservations());
        }

        // Update orderDetails
        if(orderDetailDTOList != null && !orderDetailDTOList.isEmpty()){
            orderDetailMySqlRepository.deleteAll(orderDetailMySqlRepository.findByOrderId(oldOrder.getId()));
            BigDecimal total = orderCreateUseCase.processOrderDetails(orderDetailDTOList, supplierDTO.getName(), oldOrder);
            oldOrder.setTotal(total);
            oldOrder.getOrderDetails().clear();
            oldOrder.getOrderDetails().addAll(orderDetailMySqlRepository.findByOrderId(oldOrder.getId()));
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