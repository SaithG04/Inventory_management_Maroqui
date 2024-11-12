package ucv.app_inventory.order_service.application.dto;

import lombok.Data;

@Data
public class OrderDetailDTO {
    private Long productId;
    private Integer quantity;
    private Double unitPrice;
}