package ucv.app_inventory.order_service.infrastructure.inbound.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.order_service.application.OrderFindUseCase;
import ucv.app_inventory.order_service.application.OrderCreateUseCase;
import ucv.app_inventory.order_service.application.OrderUpdateUseCase;
import ucv.app_inventory.order_service.application.OrderDeleteUseCase;
import ucv.app_inventory.order_service.application.dto.OrderDTO;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;

import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderFindUseCase orderFindUseCase;
    private final OrderCreateUseCase orderCreateUseCase;
    private final OrderUpdateUseCase orderUpdateUseCase;
    private final OrderDeleteUseCase orderDeleteUseCase;

    @Autowired
    public OrderController(OrderFindUseCase orderFindUseCase, OrderCreateUseCase orderCreateUseCase,
                           OrderUpdateUseCase orderUpdateUseCase, OrderDeleteUseCase orderDeleteUseCase) {
        this.orderFindUseCase = orderFindUseCase;
        this.orderCreateUseCase = orderCreateUseCase;
        this.orderUpdateUseCase = orderUpdateUseCase;
        this.orderDeleteUseCase = orderDeleteUseCase;
    }

    @GetMapping("/findByDate")
    public Page<Order> findOrdersByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                        Pageable pageable) {
        return orderFindUseCase.findOrdersByDate(startDate, endDate, pageable);
    }

    @GetMapping("/findByStatus")
    public Page<Order> findOrdersByStatus(@RequestParam OrderState status, Pageable pageable) {
        return orderFindUseCase.findOrdersByStatus(status, pageable);
    }

    @GetMapping("/findBySupplier")
    public Page<Order> findOrdersBySupplier(@RequestParam Long supplierId, Pageable pageable) {
        if (supplierId <= 0) {
            throw new InvalidArgumentException("El ID del proveedor no es válido.");
        }
        return orderFindUseCase.findOrdersBySupplier(supplierId, pageable);
    }

    @GetMapping("/findBySupplierAndStatus")
    public Page<Order> findOrdersBySupplierAndStatus(@RequestParam Long supplierId, @RequestParam OrderState status, Pageable pageable) {
        return orderFindUseCase.findOrdersBySupplierAndStatus(supplierId, status, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> findById(@PathVariable Long id) {
        Optional<Order> order = orderFindUseCase.findById(id);
        return order.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        Order createdOrder = orderCreateUseCase.createOrder(orderDTO);
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody OrderDTO orderDTO) {
        // Actualizar el pedido
        Order updatedOrder = orderUpdateUseCase.updateOrder(id, orderDTO);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderDeleteUseCase.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/findByCreationDate")
    public Page<Order> findByCreationDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate creationDate, Pageable pageable) {
        return orderFindUseCase.findOrdersByCreationDate(creationDate, pageable);
    }

    @GetMapping("/findByTotalRange")
    public Page<Order> findByTotalRange(@RequestParam Double minTotal, @RequestParam Double maxTotal, Pageable pageable) {
        return orderFindUseCase.findOrdersByTotalRange(minTotal, maxTotal, pageable);
    }
}
