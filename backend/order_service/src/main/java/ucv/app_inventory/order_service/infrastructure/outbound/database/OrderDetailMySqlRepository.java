package ucv.app_inventory.order_service.infrastructure.outbound.database;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucv.app_inventory.order_service.domain.model.OrderDetail;

import java.util.List;

/**
 * Repository interface for accessing and managing OrderDetail entities in a MySQL database.
 * Provides methods for querying order details based on order ID.
 */
@Repository
public interface OrderDetailMySqlRepository extends JpaRepository<OrderDetail, Long> {

    /**
     * Finds order details by order ID.
     *
     * @param orderId the ID of the order to which the details belong.
     * @return a list of order details associated with the specified order ID.
     */
    List<OrderDetail> findByOrderId(Long orderId);
}
