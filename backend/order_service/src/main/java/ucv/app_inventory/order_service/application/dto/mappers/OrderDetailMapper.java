package ucv.app_inventory.order_service.application.dto.mappers;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ucv.app_inventory.order_service.application.dto.OrderDetailDTO;
import ucv.app_inventory.order_service.application.dto.ProductDTO;
import ucv.app_inventory.order_service.application.dto.ProductSupplierDTO;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProductAPIClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderDetailMapper {

    private final ProductAPIClient productAPIClient;
    private final OrderMySqlRepository orderMySqlRepository;

    public OrderDetailDTO mapToOrderDetailDTO(OrderDetail orderDetail) {
        if (orderDetail == null) {
            throw new InvalidArgumentException("Order is null");
        }

        OrderDetailDTO orderDetailDTO = new OrderDetailDTO();

        if (orderDetail.getId() != null) {
            orderDetailDTO.setId(orderDetail.getId());
        }else {
            throw new InvalidArgumentException("Order id is null");
        }

        Long productSupplierId = orderDetail.getProductSupplierId();
        if (productSupplierId != null) {
            ProductSupplierDTO productSupplierDTO =
                    productAPIClient.getRelationById(productSupplierId).orElseThrow(() -> new InvalidArgumentException("Product supplier not found"));
            Long productId = productSupplierDTO.getProductId();
            if (productId != null) {
                ProductDTO productDTO = productAPIClient.getProductById(productId);
                if (productDTO != null) {
                    orderDetailDTO.setProductName(productDTO.getName());
                }else {
                    throw new InvalidArgumentException("Product not found");
                }
            } else {
                throw new InvalidArgumentException("Product supplier not found");
            }
        } else {
            throw new InvalidArgumentException("Product supplier id is null");
        }

        if (orderDetail.getQuantity() != null && orderDetail.getQuantity() > 0) {
            orderDetailDTO.setQuantity(orderDetail.getQuantity());
        } else {
            orderDetailDTO.setQuantity(null);
            throw new InvalidArgumentException("Quantity is invalid");
        }

        if (orderDetail.getOrder().getId() != null) {
            orderDetailDTO.setOrderId(orderDetail.getOrder().getId());
        }
        return orderDetailDTO;
    }

    public OrderDetail mapToOrderDetail(OrderDetailDTO orderDetailDTO, Long supplierId) {
        if (orderDetailDTO == null) {
            throw new InvalidArgumentException("OrderDetail is null");
        }

        OrderDetail orderDetail = new OrderDetail();

        /*if (orderDetailDTO.getId() != null) {
            orderDetail.setId(orderDetailDTO.getId());
        }else {
            throw new InvalidArgumentException("OrderDetail id is null");
        }*/

        Order order = orderMySqlRepository.findById(orderDetailDTO.getOrderId()).orElseThrow(() -> new InvalidArgumentException("Order not found"));
        orderDetail.setOrder(order);

        String productName = orderDetailDTO.getProductName();
        if (productName != null) {
            List<ProductDTO> productsByName = productAPIClient.getProductsByName(productName, 0, 1)
                    .orElseThrow(() -> new InvalidArgumentException("Product not found"));
            Long productId = productsByName.getFirst().getId();
            ProductSupplierDTO productSupplierDTO = productAPIClient.getRelationByProductIdAndSupplierId(productId, supplierId).orElseThrow(
                    () -> new InvalidArgumentException("Product-supplier relation not found"));
            orderDetail.setProductSupplierId(productSupplierDTO.getId());
        } else {
            throw new InvalidArgumentException("OrderDetail product name is null");
        }

        if(orderDetailDTO.getQuantity() != null) {
            orderDetail.setQuantity(orderDetailDTO.getQuantity());
        }else {
            orderDetail.setQuantity(null);
        }

        return orderDetail;
    }
}
