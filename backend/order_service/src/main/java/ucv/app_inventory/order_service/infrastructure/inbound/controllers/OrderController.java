package ucv.app_inventory.order_service.infrastructure.inbound.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.order_service.application.OrderFindUseCase;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderState;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
public class OrderController {

    private final OrderFindUseCase orderFindUseCase;

    @Autowired
    public OrderController(OrderFindUseCase orderFindUseCase) {
        this.orderFindUseCase = orderFindUseCase;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> buscarPorId(@PathVariable Long id) {
        Optional<Order> pedido = orderFindUseCase.buscarPorId(id);
        return pedido.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscarPorFecha")
    public Page<Order> buscarPedidosPorFecha(@RequestParam Date startDate,
                                             @RequestParam Date endDate,
                                             Pageable pageable) {
        return orderFindUseCase.buscarPedidosPorFecha(startDate, endDate, pageable);
    }

    @GetMapping("/buscarPorProveedor")
    public Page<Order> buscarPedidosPorProveedor(@RequestParam Long proveedorId, Pageable pageable) {
        return orderFindUseCase.buscarPedidosPorProveedor(proveedorId, pageable);
    }

    @GetMapping("/buscarPorEstado")
    public Page<Order> buscarPedidosPorEstado(@RequestParam OrderState estado, Pageable pageable) {
        return orderFindUseCase.buscarPedidosPorEstado(estado, pageable);
    }

    @GetMapping("/buscarPorProveedorYEstado")
    public Page<Order> buscarPedidosPorProveedorYEstado(@RequestParam Long proveedorId,
                                                        @RequestParam OrderState estado,
                                                        Pageable pageable) {
        return orderFindUseCase.buscarPedidosPorProveedorYEstado(proveedorId, estado, pageable);
    }
}
