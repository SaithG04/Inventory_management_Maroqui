package ucv.app_inventory.order_service.application.dto.mappers;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import ucv.app_inventory.order_service.application.dto.*;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.exception.SupplierNotFoundException;
import ucv.app_inventory.order_service.infrastructure.outbound.external.SupplierAPIClient;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private static final Logger logger = LoggerFactory.getLogger(OrderMapper.class);
    private final SupplierAPIClient supplierAPIClient;

    public OrderDTO mapToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();

        if (order == null) {
            throw new InvalidArgumentException("Order is null");
        }

        if (order.getId() != null) {
            orderDTO.setId(order.getId());
            try {
                if (order.getSupplierId() != null) {
                    SupplierDTO supplierDTO = supplierAPIClient.getSupplierById(order.getSupplierId())
                            .orElseThrow(() -> new SupplierNotFoundException(supplierNotFoundInOrder(order.getId(), order.getSupplierId())));
                    logger.info("Supplier: {}", supplierDTO);
                    orderDTO.setSupplierName(supplierDTO.getName());
                }else {
                    orderDTO.setSupplierName(null);
                }
            } catch (FeignException.NotFound e) {
                throw new SupplierNotFoundException(supplierNotFoundInOrder(order.getId(), order.getSupplierId() == null ? null : order.getSupplierId()));
            }
        }else {
            orderDTO.setId(null);
        }

        orderDTO.setStatus(order.getStatus() == null ? null : String.valueOf(order.getStatus()));
        orderDTO.setObservations(order.getObservations() == null ? null : order.getObservations());
        orderDTO.setOrderDate(order.getOrderDate() == null ? null : order.getOrderDate().toString());
        orderDTO.setTotal(order.getTotal());
        orderDTO.setCreatedAt(order.getCreationDate() == null ? null : order.getCreationDate());

        return orderDTO;
    }

    public Order mapToOrder(OrderDTO orderDTO) {
        Order order = new Order();

        if (orderDTO == null) {
            throw new InvalidArgumentException("Order is null");
        }
        // Map basic fields from OrderCreateDTO to Order
        order.setId(orderDTO.getId());
        order.setStatus(OrderState.valueOf(orderDTO.getStatus()));
        order.setObservations(orderDTO.getObservations());
        order.setOrderDate(orderDTO.getOrderDate() == null ? null : LocalDate.parse(orderDTO.getOrderDate()));
        order.setTotal(orderDTO.getTotal());
        order.setCreationDate(orderDTO.getCreatedAt());

        // Get the Supplier by name from the OrderCreateDTO
        if (orderDTO.getSupplierName() != null) {
            String supplierName = orderDTO.getSupplierName();
            Page<SupplierDTO> supplierByName = supplierAPIClient.getSupplierByName(supplierName, Pageable.unpaged());

            logger.info("Page: {}", supplierByName.getContent().getFirst().toString());

            if (supplierByName.getContent().isEmpty()) {
                throw new SupplierNotFoundException("No supplier found for name: " + supplierName);
            }
            order.setSupplierId(supplierByName.getContent().getFirst().getId()); // Set supplierId in the Order
        }else {
            order.setSupplierId(null);
        }

        return order;
    }

    private String supplierNotFoundInOrder(Long order_id, Long supplier_id) {
        return "The order with ID " + order_id + " contains a supplier with ID " + supplier_id
                + ", but the supplier no longer exists in the database. Please verify if the supplier has been deleted.";
    }
}
