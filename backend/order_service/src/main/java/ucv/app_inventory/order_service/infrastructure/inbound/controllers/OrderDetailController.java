package ucv.app_inventory.order_service.infrastructure.inbound.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.order_service.application.OrderDetailUpdateUseCase;
import ucv.app_inventory.order_service.application.OrderDetailDeleteUseCase;
import ucv.app_inventory.order_service.application.OrderDetailFindUseCase;
import ucv.app_inventory.order_service.application.OrderFindUseCase;
import ucv.app_inventory.order_service.application.dto.OrderDetailDTO;
import ucv.app_inventory.order_service.application.dto.mappers.OrderDetailMapper;
import ucv.app_inventory.order_service.application.dto.mappers.OrderMapper;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.exception.OrderDetailNotFoundException;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {

    private final OrderDetailFindUseCase orderDetailFindUseCase;
    private final OrderDetailUpdateUseCase orderDetailUpdateUseCase;
    private final OrderDetailDeleteUseCase orderDetailDeleteUseCase;
    private final OrderFindUseCase orderFindUseCase;
    private final OrderDetailMapper orderDetailMapper;
    private final OrderMapper orderMapper;

    @Autowired
    public OrderDetailController(OrderDetailFindUseCase orderDetailFindUseCase,
                                 OrderDetailUpdateUseCase orderDetailUpdateUseCase,
                                 OrderDetailDeleteUseCase orderDetailDeleteUseCase, OrderFindUseCase orderFindUseCase, OrderDetailMapper orderDetailMapper, OrderMapper orderMapper) {
        this.orderDetailFindUseCase = orderDetailFindUseCase;
        this.orderDetailUpdateUseCase = orderDetailUpdateUseCase;
        this.orderDetailDeleteUseCase = orderDetailDeleteUseCase;
        this.orderFindUseCase = orderFindUseCase;
        this.orderDetailMapper = orderDetailMapper;
        this.orderMapper = orderMapper;
    }

    /*@GetMapping("/findByOrderId/{orderId}")
    public ResponseEntity<List<OrderDetail>> findByOrderId(@PathVariable Long orderId) {
        List<OrderDetail> orderDetails = orderDetailFindUseCase.findByOrderDetailId(orderId);
        if (orderDetails.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orderDetails);
    }*/

    @PutMapping("/update/{id}")
    public ResponseEntity<OrderDetailDTO> updateOrderDetail(@PathVariable Long id, @RequestBody OrderDetailDTO orderDetailDTO) {
        orderDetailDTO.setId(id);
        OrderDetailDTO updatedOrderDetailDTO = orderDetailUpdateUseCase.updateOrderDetail(orderDetailDTO);
        return ResponseEntity.ok(updatedOrderDetailDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long id) {
        orderDetailDeleteUseCase.deleteOrderDetail(id);
        return ResponseEntity.noContent().build();
    }
}
