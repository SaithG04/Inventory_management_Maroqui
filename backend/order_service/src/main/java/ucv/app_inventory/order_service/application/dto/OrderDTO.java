package ucv.app_inventory.order_service.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class OrderDTO {
    private Long id;

    @JsonProperty("supplier_name")
    private String supplierName;
    private String status;
    private List<OrderDetailDTO> orderDetails;
    private String observations;
    private String orderDate;
}