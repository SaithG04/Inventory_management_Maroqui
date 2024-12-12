package ucv.app_inventory.application.DTO;

import lombok.Data;

@Data
public class ProductSupplierDTO {
    private Long productSupplierId;
    private String productName;
    private String supplierName;
    private Double price;  // El precio se pasa en la solicitud
}