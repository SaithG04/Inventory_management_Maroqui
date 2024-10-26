package ucv.app_inventory.order_service.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.order_service.domain.Pedido;
import ucv.app_inventory.order_service.application.service.PedidoService;
import ucv.app_inventory.order_service.domain.EstadoPedido;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    @Autowired
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoService.buscarPorId(id);
        return pedido.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscarPorFecha")
    public Page<Pedido> buscarPedidosPorFecha(@RequestParam LocalDate startDate,
                                              @RequestParam LocalDate endDate,
                                              Pageable pageable) {
        return pedidoService.buscarPedidosPorFecha(startDate, endDate, pageable);
    }

    @GetMapping("/buscarPorProveedor")
    public Page<Pedido> buscarPedidosPorProveedor(@RequestParam Long proveedorId, Pageable pageable) {
        return pedidoService.buscarPedidosPorProveedor(proveedorId, pageable);
    }

    @GetMapping("/buscarPorEstado")
    public Page<Pedido> buscarPedidosPorEstado(@RequestParam EstadoPedido estado, Pageable pageable) {
        return pedidoService.buscarPedidosPorEstado(estado, pageable);
    }

    @GetMapping("/buscarPorProveedorYEstado")
    public Page<Pedido> buscarPedidosPorProveedorYEstado(@RequestParam Long proveedorId,
                                                         @RequestParam EstadoPedido estado,
                                                         Pageable pageable) {
        return pedidoService.buscarPedidosPorProveedorYEstado(proveedorId, estado, pageable);
    }
}
