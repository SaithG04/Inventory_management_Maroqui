package ucv.app_inventory.order_service.infrastructure.outbound.database;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderState;

import java.time.LocalDate;
import java.util.Date;

/**
 * Repository interface for accessing and managing Order entities in a MySQL database.
 * Provides methods for querying orders based on date ranges, supplier ID, and order status.
 */
@Repository
public interface OrderMySqlRepository extends JpaRepository<Order, Long> {

    /**
     * Finds orders within a specified date range.
     *
     * @param startDate  the start date of the range.
     * @param endDate    the end date of the range.
     * @param pageable   pagination information.
     * @return a page of orders within the specified date range.
     */
    Page<Order> findByOrderDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    /**
     * Finds orders by supplier ID and status.
     *
     * @param supplierId the ID of the supplier.
     * @param status     the current status of the order.
     * @param pageable   pagination information.
     * @return a page of orders matching the supplier ID and status.
     */
    Page<Order> findBySupplierIdAndStatus(Long supplierId, OrderState status, Pageable pageable);

    /**
     * Finds orders by supplier ID.
     *
     * @param supplierId the ID of the supplier.
     * @param pageable   pagination information.
     * @return a page of orders associated with the specified supplier ID.
     */
    Page<Order> findBySupplierId(Long supplierId, Pageable pageable);

    /**
     * Finds orders by status.
     *
     * @param status   the current status of the order.
     * @param pageable pagination information.
     * @return a page of orders matching the specified status.
     */
    Page<Order> findByStatus(OrderState status, Pageable pageable);

    Page<Order> findByCreationDate(LocalDate creationDate, Pageable pageable);

    Page<Order> findByTotalBetween(Double minTotal, Double maxTotal, Pageable pageable);

}