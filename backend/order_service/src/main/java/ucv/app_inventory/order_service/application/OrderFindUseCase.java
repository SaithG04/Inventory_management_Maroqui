package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderFindUseCase {

    private final OrderMySqlRepository orderMySqlRepository;

    public Optional<Order> buscarPorId(Long id) {
        return orderMySqlRepository.findById(id);
    }

    public Page<Order> listarPedidosPaginados(Pageable pageable) {
        return orderMySqlRepository.findAll(pageable);
    }

    @Cacheable("pedidosPorFecha")
    public Page<Order> buscarPedidosPorFecha(Date startDate, Date endDate, Pageable pageable) {
        return orderMySqlRepository.findByFechaBetween(startDate, endDate, pageable);
    }

    @Cacheable("pedidosPorProveedor")
    public Page<Order> buscarPedidosPorProveedor(Long proveedorId, Pageable pageable) {
        return orderMySqlRepository.findByProveedorId(proveedorId, pageable);
    }

    @Cacheable("pedidosPorEstado")
    public Page<Order> buscarPedidosPorEstado(OrderState estado, Pageable pageable) {
        return orderMySqlRepository.findByEstado(estado, pageable);
    }

    @Cacheable("pedidosPorProveedorYEstado")
    public Page<Order> buscarPedidosPorProveedorYEstado(Long proveedorId, OrderState estado, Pageable pageable) {
        return orderMySqlRepository.findByProveedorIdAndEstado(proveedorId, estado, pageable);
    }
}
