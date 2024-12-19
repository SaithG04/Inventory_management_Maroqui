package ucv.app_inventory.order_service.infrastructure.inbound.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.order_service.application.OrderDetailUpdateUseCase;
import ucv.app_inventory.order_service.application.OrderDetailDeleteUseCase;
import ucv.app_inventory.order_service.application.dto.OrderDetailDTO;

@RestController
@RequestMapping("/order-details")
public class OrderDetailController {

    private final OrderDetailUpdateUseCase orderDetailUpdateUseCase;
    private final OrderDetailDeleteUseCase orderDetailDeleteUseCase;

    @Autowired
    public OrderDetailController(OrderDetailUpdateUseCase orderDetailUpdateUseCase,
                                 OrderDetailDeleteUseCase orderDetailDeleteUseCase) {
        this.orderDetailUpdateUseCase = orderDetailUpdateUseCase;
        this.orderDetailDeleteUseCase = orderDetailDeleteUseCase;
    }

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
