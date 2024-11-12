package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderFindUseCase {

    private final OrderMySqlRepository orderMySqlRepository;

    public Optional<Order> findById(Long id) {
        return orderMySqlRepository.findById(id);
    }

    public Page<Order> listOrdersPaginated(Pageable pageable) {
        return orderMySqlRepository.findAll(pageable);
    }

    @Cacheable("ordersByDate")
    public Page<Order> findOrdersByDate(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return orderMySqlRepository.findByOrderDateBetween(startDate, endDate, pageable);
    }

    @Cacheable("ordersBySupplier")
    public Page<Order> findOrdersBySupplier(Long supplierId, Pageable pageable) {
        return orderMySqlRepository.findBySupplierId(supplierId, pageable);
    }

    @Cacheable("ordersByStatus")
    public Page<Order> findOrdersByStatus(OrderState status, Pageable pageable) {
        return orderMySqlRepository.findByStatus(status, pageable);
    }

    @Cacheable("ordersBySupplierAndStatus")
    public Page<Order> findOrdersBySupplierAndStatus(Long supplierId, OrderState status, Pageable pageable) {
        return orderMySqlRepository.findBySupplierIdAndStatus(supplierId, status, pageable);
    }

    @Cacheable("ordersByCreationDate")
    public Page<Order> findOrdersByCreationDate(LocalDate creationDate, Pageable pageable) {
        return orderMySqlRepository.findByCreationDate(creationDate, pageable);
    }

    public Page<Order> findOrdersByTotalRange(Double minTotal, Double maxTotal, Pageable pageable) {
        return orderMySqlRepository.findByTotalBetween(minTotal, maxTotal, pageable);
    }
}
