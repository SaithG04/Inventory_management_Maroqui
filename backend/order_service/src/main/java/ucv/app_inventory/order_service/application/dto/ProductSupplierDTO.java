package ucv.app_inventory.order_service.application.dto;

import lombok.Data;

@Data
public class ProductSupplierDTO {
    private Long id;
    private Long productId;
    private Long supplierId;
    private Double price;
}