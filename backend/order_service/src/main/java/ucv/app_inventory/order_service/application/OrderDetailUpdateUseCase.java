package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ucv.app_inventory.order_service.application.dto.*;
import ucv.app_inventory.order_service.application.dto.mappers.OrderDetailMapper;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.exception.OrderDetailNotFoundException;
import ucv.app_inventory.order_service.exception.ProductSupplierNotFound;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProductAPIClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailUpdateUseCase {

    private final OrderDetailMySqlRepository orderDetailRepository;
    private final ProductAPIClient productAPIClient;
    private final OrderDetailMapper orderDetailMapper;

    public OrderDetailDTO updateOrderDetail(OrderDetailDTO orderDetailDTO) {

        if(orderDetailDTO.getId() != null) {
            OrderDetail oldOrderDetail = orderDetailRepository.findById(orderDetailDTO.getId())
                    .orElseThrow(() -> new OrderDetailNotFoundException("OrderDetail not found"));

            OrderDetail newOrderDetail = new OrderDetail();
            newOrderDetail.setId(orderDetailDTO.getId());
            newOrderDetail.setOrder(oldOrderDetail.getOrder());
            if(orderDetailDTO.getQuantity() != null) {
                if (orderDetailDTO.getQuantity() <= 0){
                    throw new InvalidArgumentException("Quantity must be greater than zero");
                }

                newOrderDetail.setQuantity(orderDetailDTO.getQuantity());
            }else {
                throw new InvalidArgumentException("Quantity is required");
            }


            List<ProductDTO> productDTOList = productAPIClient.getProductsByName(orderDetailDTO.getProductName(), 0, 1)
                    .orElseThrow(() -> new InvalidArgumentException("Product not found."));
            Long productId = productDTOList.getFirst().getId();
            Long supplierId = oldOrderDetail.getOrder().getSupplierId();

            ProductSupplierDTO productSupplierDTO = productAPIClient.getRelationByProductIdAndSupplierId(productId, supplierId)
                    .orElseThrow(() -> new ProductSupplierNotFound("Product-Supplier relation not found"));
            newOrderDetail.setProductSupplierId(productSupplierDTO.getId());
            return orderDetailMapper.mapToOrderDetailDTO(orderDetailRepository.save(newOrderDetail));
        } else {
            throw new InvalidArgumentException("Order detail id is mandatory");
        }
    }

}