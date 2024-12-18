package ucv.app_inventory.application.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ProductSupplierDTO {
    @JsonProperty("id")
    private Long productSupplierId;
    @JsonProperty("nombre_producto")
    private String productName;
    @JsonProperty("nombre_proveedor")
    private String supplierName;
    @JsonProperty("precio_compra")
    private Double price;
}