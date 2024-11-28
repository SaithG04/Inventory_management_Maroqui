package ucv.app_inventory.order_service.infrastructure.inbound.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.order_service.application.OrderDetailUpdateUseCase;
import ucv.app_inventory.order_service.application.OrderDetailDeleteUseCase;
import ucv.app_inventory.order_service.application.OrderDetailFindUseCase;
import ucv.app_inventory.order_service.application.dto.OrderDetailDTO;
import ucv.app_inventory.order_service.domain.model.OrderDetail;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {

    private final OrderDetailFindUseCase orderDetailFindUseCase;
    private final OrderDetailUpdateUseCase orderDetailUpdateUseCase;
    private final OrderDetailDeleteUseCase orderDetailDeleteUseCase;

    @Autowired
    public OrderDetailController(OrderDetailFindUseCase orderDetailFindUseCase,
                                 OrderDetailUpdateUseCase orderDetailUpdateUseCase,
                                 OrderDetailDeleteUseCase orderDetailDeleteUseCase) {
        this.orderDetailFindUseCase = orderDetailFindUseCase;
        this.orderDetailUpdateUseCase = orderDetailUpdateUseCase;
        this.orderDetailDeleteUseCase = orderDetailDeleteUseCase;
    }

    @GetMapping("/findByOrderId/{orderId}")
    public ResponseEntity<List<OrderDetail>> findByOrderId(@PathVariable Long orderId) {
        List<OrderDetail> orderDetails = orderDetailFindUseCase.findByOrderId(orderId);
        if (orderDetails.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orderDetails);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OrderDetail> updateOrderDetail(@PathVariable Long id, @RequestBody OrderDetailDTO orderDetailDTO) {
        OrderDetail updatedOrderDetail = orderDetailUpdateUseCase.updateOrderDetail(id, orderDetailDTO);
        return ResponseEntity.ok(updatedOrderDetail);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long id) {
        orderDetailDeleteUseCase.deleteOrderDetail(id);
        return ResponseEntity.noContent().build();
    }
}
