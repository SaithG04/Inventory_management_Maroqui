package ucv.app_inventory.order_service.application.service;

import ucv.app_inventory.order_service.domain.Pedido;
import ucv.app_inventory.order_service.application.dto.ProveedorDTO;
import ucv.app_inventory.order_service.application.dto.ProductoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ucv.app_inventory.order_service.domain.EstadoPedido;

import java.time.LocalDate;
import java.util.Optional;

public interface PedidoService {

    Pedido crearPedido(Pedido pedido);

    Pedido actualizarPedido(Pedido pedido);

    void eliminarPedido(Long id);

    Optional<Pedido> buscarPorId(Long id);  // Utilizar Optional para búsquedas por ID

    ProveedorDTO obtenerProveedor(Long proveedorId);

    ProductoDTO obtenerProducto(Long productoId);

    Page<Pedido> listarPedidosPaginados(Pageable pageable);

    Page<Pedido> buscarPedidosPorFecha(LocalDate startDate, LocalDate endDate, Pageable pageable);

    Page<Pedido> buscarPedidosPorProveedor(Long proveedorId, Pageable pageable);

    Page<Pedido> buscarPedidosPorEstado(EstadoPedido estado, Pageable pageable);

    Page<Pedido> buscarPedidosPorProveedorYEstado(Long proveedorId, EstadoPedido estado, Pageable pageable);
}
