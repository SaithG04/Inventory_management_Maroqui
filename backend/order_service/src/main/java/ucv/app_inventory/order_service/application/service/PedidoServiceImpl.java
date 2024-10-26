package ucv.app_inventory.order_service.application.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.domain.Pedido;
import ucv.app_inventory.order_service.infrastructure.repository.PedidoRepository;
import ucv.app_inventory.order_service.application.client.ProveedorClient;
import ucv.app_inventory.order_service.application.client.ProductoClient;
import ucv.app_inventory.order_service.application.dto.ProveedorDTO;
import ucv.app_inventory.order_service.application.dto.ProductoDTO;
import ucv.app_inventory.order_service.domain.EstadoPedido;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProveedorClient proveedorClient;
    private final ProductoClient productClient;

    @Autowired
    public PedidoServiceImpl(PedidoRepository pedidoRepository, ProveedorClient proveedorClient, ProductoClient productClient) {
        this.pedidoRepository = pedidoRepository;
        this.proveedorClient = proveedorClient;
        this.productClient = productClient;
    }

    @Override
    public Pedido crearPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    @Override
    public Pedido actualizarPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    @Override
    public void eliminarPedido(Long id) {
        pedidoRepository.deleteById(id);
    }

    @Override
    public Optional<Pedido> buscarPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    @Override
    public Page<Pedido> listarPedidosPaginados(Pageable pageable) {
        return pedidoRepository.findAll(pageable);
    }

    @Override
    @Cacheable("pedidosPorFecha")
    public Page<Pedido> buscarPedidosPorFecha(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return pedidoRepository.findByFechaBetween(startDate, endDate, pageable);
    }

    @Override
    @Cacheable("pedidosPorProveedor")
    public Page<Pedido> buscarPedidosPorProveedor(Long proveedorId, Pageable pageable) {
        return pedidoRepository.findByProveedorId(proveedorId, pageable);
    }

    @Override
    @Cacheable("pedidosPorEstado")
    public Page<Pedido> buscarPedidosPorEstado(EstadoPedido estado, Pageable pageable) {
        return pedidoRepository.findByEstado(estado, pageable);
    }

    @Override
    @Cacheable("pedidosPorProveedorYEstado")
    public Page<Pedido> buscarPedidosPorProveedorYEstado(Long proveedorId, EstadoPedido estado, Pageable pageable) {
        return pedidoRepository.findByProveedorIdAndEstado(proveedorId, estado, pageable);
    }

    @Override
    public ProveedorDTO obtenerProveedor(Long proveedorId) {
        return proveedorClient.getProviderById(proveedorId);
    }

    @Override
    public ProductoDTO obtenerProducto(Long productoId) {
        return productClient.getProductById(productoId);
    }
}
