package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.application.dto.*;
import ucv.app_inventory.order_service.application.dto.mappers.OrderMapper;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.SupplierAPIClient;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderFindUseCase {

    private final OrderMySqlRepository orderMySqlRepository;
    //private final OrderDetailMySqlRepository orderDetailMySqlRepository;
    private final SupplierAPIClient supplierAPIClient;
    private final OrderMapper orderMapper;

    private static final Logger logger = LoggerFactory.getLogger(OrderFindUseCase.class);

    /**
     * Finds an order by its ID.
     * Throws an exception if the order is not found.
     *
     * @param id the ID of the order to find.
     * @return the found order.
     * @throws OrderNotFoundException if the order with the specified ID is not found.
     */
    public Order findById(Object id) {
        if(id == null) return null;
        long id_;
        try {
            id_ = Long.parseLong(id.toString());
        }catch (NumberFormatException e) {
            throw new InvalidArgumentException("ID must be a natural number");
        }

        if(id_ <= 0){
            throw new InvalidArgumentException("Invalid ID");
        }

        return orderMySqlRepository.findById(id_)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
    }

    /**
     * Lists all orders with pagination.
     *
     * @param pageable the pagination information.
     * @return a Page of orders.
     */
    @Cacheable(value = "orders")
    public Page<OrderDTO> listOrdersPaginated(Pageable pageable) {
        Page<Order> orders = orderMySqlRepository.findAll(pageable);
        try {
            return orders.map(orderMapper::mapToOrderDTO);
        } catch (InvalidArgumentException e) {
            throw new InvalidArgumentException(e.getMessage());
        }
    }

    /**
     * Finds orders within a specified date range and paginates the result.
     * Caches the result based on the start date, end date, and page number to optimize repeated queries.
     *
     * @param startDate the start date for the range.
     * @param endDate   the end date for the range.
     * @param pageable  the pagination information.
     * @return a Page of orders within the date range.
     * @throws InvalidArgumentException if the start date is after the end date.
     */
    @Cacheable(value = "ordersByDate", key = "#startDate + '-' + #endDate + '-' + #pageable.pageNumber")
    public Page<OrderDTO> findOrdersByDate(LocalDate startDate, LocalDate endDate, Pageable pageable) throws InvalidArgumentException {
        validateDateRange(startDate, endDate);  // Validar el rango de fechas antes de consultar la base de datos.

        Page<Order> orders = orderMySqlRepository.findByOrderDateBetween(startDate, endDate, pageable);
        try {
            return orders.map(orderMapper::mapToOrderDTO);
        } catch (InvalidArgumentException e) {
            throw new InvalidArgumentException(e.getMessage());
        }
    }

    /**
     * Finds orders by supplier name and applies pagination.
     * Caches the result based on the supplier name and page number.
     *
     * @param supplier_name the supplier to search for.
     * @param pageable      the pagination information.
     * @return a Page of orders associated with the supplier.
     * @throws InvalidArgumentException if the supplier name is invalid.
     */
    @Cacheable(value = "ordersBySupplier", key = "#supplier_name + '-' + #pageable.pageNumber")
    public Page<OrderDTO> findOrdersBySupplier(String supplier_name, Pageable pageable) throws InvalidArgumentException {
        Long supplierId = validateSupplierName(supplier_name);// Validate the supplier name before querying.
        Page<Order> orders = orderMySqlRepository.findBySupplierId(supplierId, pageable);
        try {
            return orders.map(orderMapper::mapToOrderDTO);
        } catch (InvalidArgumentException e) {
            throw new InvalidArgumentException(e.getMessage());
        }
    }

    /**
     * Finds orders by their status and applies pagination.
     * Caches the result based on the status and page number.
     *
     * @param status   the order status to filter by.
     * @param pageable the pagination information.
     * @return a Page of orders with the specified status.
     */
    @Cacheable(value = "ordersByStatus", key = "#status + '-' + #pageable.pageNumber")
    public Page<OrderDTO> findOrdersByStatus(String status, Pageable pageable) {
        OrderState orderState = validateStatus(status);
        Page<Order> orders = orderMySqlRepository.findByStatus(orderState, pageable);
        try {
            return orders.map(orderMapper::mapToOrderDTO);
        } catch (InvalidArgumentException e) {
            throw new InvalidArgumentException(e.getMessage());
        }
    }

    /**
     * Finds orders by supplier name and order status, with pagination.
     * Caches the result based on the supplier name, status, and page number.
     *
     * @param supplierName the supplier name to filter by.
     * @param status       the order status to filter by.
     * @param pageable     the pagination information.
     * @return a Page of orders associated with the supplier and status.
     */
    @Cacheable(value = "ordersBySupplierAndStatus", key = "#supplierName + '-' + #status + '-' + #pageable.pageNumber")
    public Page<OrderDTO> findOrdersBySupplierAndStatus(String supplierName, String status, Pageable pageable) {
        Long supplierId = validateSupplierName(supplierName);// Validate the supplier name before querying.
        OrderState orderState = validateStatus(status);
        Page<Order> orders = orderMySqlRepository.findBySupplierIdAndStatus(supplierId, orderState, pageable);
        try {
            return orders.map(orderMapper::mapToOrderDTO);
        } catch (InvalidArgumentException e) {
            throw new InvalidArgumentException(e.getMessage());
        }
    }

    /**
     * Finds orders by their creation date with pagination.
     * Caches the result based on the creation date and page number.
     *
     * @param creationDate the creation date to search for.
     * @param pageable     the pagination information.
     * @return a Page of orders created on the specified date.
     */
    @Cacheable(value = "ordersByCreationDate", key = "#creationDate + '-' + #pageable.pageNumber")
    public Page<Order> findOrdersByCreationDate(LocalDate creationDate, Pageable pageable) {
        return orderMySqlRepository.findByCreationDate(creationDate, pageable);
    }

    /**
     * Finds orders within a specified total range and applies pagination.
     *
     * @param minTotal the minimum total value.
     * @param maxTotal the maximum total value.
     * @param pageable the pagination information.
     * @return a Page of orders within the specified total range.
     */
    public Page<Order> findOrdersByTotalRange(Double minTotal, Double maxTotal, Pageable pageable) {
        validateTotalRange(minTotal, maxTotal);  // Validate the total range before querying.
        return orderMySqlRepository.findByTotalBetween(minTotal, maxTotal, pageable);
    }

    /**
     * Validates that the supplier name.
     *
     * @param supplierName the supplier name to validate.
     * @throws InvalidArgumentException if the supplier name is invalid.
     */
    private Long validateSupplierName(String supplierName) {
        if (supplierName == null || supplierName.isEmpty()) {
            throw new InvalidArgumentException("The supplier name cannot be null or empty.");
        }
        Page<SupplierDTO> supplierByName = supplierAPIClient.getSupplierByName(supplierName, Pageable.unpaged());
        logger.info("Supplier response page number: {}", supplierByName.getNumber());
        logger.info("Total elements: {}", supplierByName.getTotalElements());
        if (supplierByName.getContent().isEmpty()) {
            throw new InvalidArgumentException("No supplier found for name: " + supplierName);
        }
        SupplierDTO supplierDTO = supplierByName.getContent().getFirst();
        return supplierDTO.getId();
    }

    /**
     * Validates that the start date is not after the end date.
     *
     * @param startDate the start date.
     * @param endDate   the end date.
     * @throws InvalidArgumentException if the start date is after the end date.
     */
    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new InvalidArgumentException("The start date cannot be after the end date.");
        }
    }

    /**
     * Validates that the minimum total is not greater than the maximum total.
     *
     * @param minTotal the minimum total amount.
     * @param maxTotal the maximum total amount.
     * @throws InvalidArgumentException if the minimum total is greater than the maximum total.
     */
    private void validateTotalRange(Double minTotal, Double maxTotal) {
        if (minTotal != null && maxTotal != null && minTotal > maxTotal) {
            throw new InvalidArgumentException("The minimum total cannot be greater than the maximum total.");
        }
    }

    private OrderState validateStatus(String status) {
        if (status == null) {
            throw new InvalidArgumentException("The status cannot be null.");
        } else if (!status.equals("PENDING") && !status.equals("PROCESSED") && !status.equals("CANCELED")) {
            throw new InvalidArgumentException("The status is not valid.");
        }
        return OrderState.valueOf(status);
    }

}
