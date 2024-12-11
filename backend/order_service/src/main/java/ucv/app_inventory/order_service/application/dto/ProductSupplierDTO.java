package ucv.app_inventory.order_service.application.dto;

import lombok.Data;

@Data
public class ProductSupplierDTO {
    private int id;
    private Long productId;
    private Long supplierId;
    private Double price;  // El precio se pasa en la solicitud
}