package ucv.app_inventory.order_service.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ProductDTO {


    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
}
