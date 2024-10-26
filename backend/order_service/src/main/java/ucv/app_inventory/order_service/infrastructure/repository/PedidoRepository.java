package ucv.app_inventory.order_service.infrastructure.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ucv.app_inventory.order_service.domain.Pedido;
import ucv.app_inventory.order_service.domain.EstadoPedido;

import java.time.LocalDate;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Manteniendo las búsquedas paginadas
    Page<Pedido> findByFechaBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    Page<Pedido> findByProveedorIdAndEstado(Long proveedorId, EstadoPedido estado, Pageable pageable);

    Page<Pedido> findByProveedorId(Long proveedorId, Pageable pageable);

    Page<Pedido> findByEstado(EstadoPedido estado, Pageable pageable);

    // Nuevo: Buscar un pedido por ID usando Optional
    @Override
    Optional<Pedido> findById(Long id);
}
