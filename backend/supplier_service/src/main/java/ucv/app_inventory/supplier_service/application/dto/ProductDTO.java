package ucv.app_inventory.supplier_service.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ProductDTO {

    @JsonProperty("id_producto")
    private Long id;

    @JsonProperty("nombre")
    private String name;

    @JsonProperty("descripcion")
    private String description;

    //private Double price;

    @JsonProperty("stock")
    private Integer stock;
}
