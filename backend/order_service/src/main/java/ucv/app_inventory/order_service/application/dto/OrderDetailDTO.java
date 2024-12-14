package ucv.app_inventory.order_service.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OrderDetailDTO {

    private Long id;

    @JsonProperty("order_id")
    private Long orderId;

    @JsonProperty("product_name")
    private String productName;

    private Long quantity;
}