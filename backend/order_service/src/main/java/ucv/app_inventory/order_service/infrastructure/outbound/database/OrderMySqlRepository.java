package ucv.app_inventory.order_service.infrastructure.outbound.database;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderState;

import java.util.Date;

@Repository
public interface OrderMySqlRepository extends JpaRepository<Order, Long> {

    Page<Order> findByFechaBetween(Date fecha, Date fecha2, Pageable pageable);

    Page<Order> findByProveedorIdAndEstado(Long proveedorId, OrderState estado, Pageable pageable);

    Page<Order> findByProveedorId(Long proveedorId, Pageable pageable);

    Page<Order> findByEstado(OrderState estado, Pageable pageable);

}
