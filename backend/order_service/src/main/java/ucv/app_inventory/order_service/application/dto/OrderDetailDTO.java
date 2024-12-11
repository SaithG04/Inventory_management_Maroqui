package ucv.app_inventory.order_service.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OrderDetailDTO {

    @JsonProperty("product_name")
    private String productName;
    private Integer quantity;
}