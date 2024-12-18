package ucv.app_inventory.order_service.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Long id;

    @JsonProperty("supplier_name")
    private String supplierName;
    private String status;
    private String observations;
    private String orderDate;
    private BigDecimal total;
    private LocalDateTime createdAt;
}