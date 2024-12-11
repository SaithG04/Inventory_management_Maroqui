package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.application.dto.OrderDetailDTO;
import ucv.app_inventory.order_service.application.dto.ProductDTO;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;

@Service
@RequiredArgsConstructor
public class OrderDetailUpdateUseCase {

    private final OrderDetailMySqlRepository orderDetailRepository;
    private final OrderCreateUseCase orderCreateUseCase;

    public OrderDetail updateOrderDetail(Long id, OrderDetailDTO orderDetailDTO) {
        return orderDetailRepository.findById(id).map(orderDetail -> {

            ProductDTO productDTO = orderCreateUseCase.validateProductExistence(orderDetailDTO.getProductName());
            orderDetail.setProductId(productDTO.getId());
            orderDetail.setQuantity(orderDetailDTO.getQuantity());
            orderDetail.setUnitPrice(orderDetailDTO.getUnitPrice());
            return orderDetailRepository.save(orderDetail);
        }).orElseThrow(() -> new OrderNotFoundException("OrderDetail with ID " + id + " not found"));
    }
}