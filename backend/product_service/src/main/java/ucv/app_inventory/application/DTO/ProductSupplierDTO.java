package ucv.app_inventory.application.DTO;

import lombok.Data;

@Data
public class ProductSupplierDTO {
    private Long productSupplierId;
    private Long productId;
    private Long supplierId;
    private Double price;  // El precio se pasa en la solicitud
}