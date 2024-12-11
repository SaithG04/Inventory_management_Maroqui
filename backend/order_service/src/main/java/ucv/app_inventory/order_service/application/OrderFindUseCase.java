package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class OrderFindUseCase {

    private final OrderMySqlRepository orderMySqlRepository;

    /**
     * Finds an order by its ID.
     * Throws an exception if the order is not found.
     * @param id the ID of the order to find.
     * @return the found order.
     * @throws OrderNotFoundException if the order with the specified ID is not found.
     */
    public Order findById(Long id) {
        return orderMySqlRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
    }

    /**
     * Lists all orders with pagination.
     * @param pageable the pagination information.
     * @return a Page of orders.
     */
    public Page<Order> listOrdersPaginated(Pageable pageable) {
        return orderMySqlRepository.findAll(pageable);
    }

    /**
     * Finds orders within a specified date range and paginates the result.
     * Caches the result based on the start date, end date, and page number to optimize repeated queries.
     * @param startDate the start date for the range.
     * @param endDate the end date for the range.
     * @param pageable the pagination information.
     * @return a Page of orders within the date range.
     * @throws InvalidArgumentException if the start date is after the end date.
     */
    @Cacheable(value = "ordersByDate", key = "#startDate + '-' + #endDate + '-' + #pageable.pageNumber")
    public Page<Order> findOrdersByDate(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        validateDateRange(startDate, endDate);  // Validate the date range before querying the database.
        return orderMySqlRepository.findByOrderDateBetween(startDate, endDate, pageable);
    }

    /**
     * Finds orders by supplier ID and applies pagination.
     * Caches the result based on the supplier ID and page number.
     * @param supplierId the supplier ID to search for.
     * @param pageable the pagination information.
     * @return a Page of orders associated with the supplier.
     * @throws InvalidArgumentException if the supplier ID is invalid.
     */
    @Cacheable(value = "ordersBySupplier", key = "#supplierId + '-' + #pageable.pageNumber")
    public Page<Order> findOrdersBySupplier(Long supplierId, Pageable pageable) {
        validateSupplierId(supplierId);  // Validate the supplier ID before querying.
        return orderMySqlRepository.findBySupplierId(supplierId, pageable);
    }

    /**
     * Finds orders by their status and applies pagination.
     * Caches the result based on the status and page number.
     * @param status the order status to filter by.
     * @param pageable the pagination information.
     * @return a Page of orders with the specified status.
     */
    @Cacheable(value = "ordersByStatus", key = "#status + '-' + #pageable.pageNumber")
    public Page<Order> findOrdersByStatus(OrderState status, Pageable pageable) {
        return orderMySqlRepository.findByStatus(status, pageable);
    }

    /**
     * Finds orders by supplier ID and order status, with pagination.
     * Caches the result based on the supplier ID, status, and page number.
     * @param supplierId the supplier ID to filter by.
     * @param status the order status to filter by.
     * @param pageable the pagination information.
     * @return a Page of orders associated with the supplier and status.
     */
    @Cacheable(value = "ordersBySupplierAndStatus", key = "#supplierId + '-' + #status + '-' + #pageable.pageNumber")
    public Page<Order> findOrdersBySupplierAndStatus(Long supplierId, OrderState status, Pageable pageable) {
        validateSupplierId(supplierId);  // Validate the supplier ID before querying.
        return orderMySqlRepository.findBySupplierIdAndStatus(supplierId, status, pageable);
    }

    /**
     * Finds orders by their creation date with pagination.
     * Caches the result based on the creation date and page number.
     * @param creationDate the creation date to search for.
     * @param pageable the pagination information.
     * @return a Page of orders created on the specified date.
     */
    @Cacheable(value = "ordersByCreationDate", key = "#creationDate + '-' + #pageable.pageNumber")
    public Page<Order> findOrdersByCreationDate(LocalDate creationDate, Pageable pageable) {
        return orderMySqlRepository.findByCreationDate(creationDate, pageable);
    }

    /**
     * Finds orders within a specified total range and applies pagination.
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
     * Validates that the supplier ID is greater than zero.
     * @param supplierId the supplier ID to validate.
     * @throws InvalidArgumentException if the supplier ID is invalid.
     */
    private void validateSupplierId(Long supplierId) {
        if (supplierId == null || supplierId <= 0) {
            throw new InvalidArgumentException("The supplier ID must be greater than zero.");
        }
    }

    /**
     * Validates that the start date is not after the end date.
     * @param startDate the start date.
     * @param endDate the end date.
     * @throws InvalidArgumentException if the start date is after the end date.
     */
    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new InvalidArgumentException("The start date cannot be after the end date.");
        }
    }

    /**
     * Validates that the minimum total is not greater than the maximum total.
     * @param minTotal the minimum total amount.
     * @param maxTotal the maximum total amount.
     * @throws InvalidArgumentException if the minimum total is greater than the maximum total.
     */
    private void validateTotalRange(Double minTotal, Double maxTotal) {
        if (minTotal != null && maxTotal != null && minTotal > maxTotal) {
            throw new InvalidArgumentException("The minimum total cannot be greater than the maximum total.");
        }
    }
}
