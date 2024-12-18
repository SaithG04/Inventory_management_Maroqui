package ucv.app_inventory.order_service.application.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductSupplierDTO {
    private Long id;
    private Long productId;
    private Long supplierId;
    private BigDecimal price;
}