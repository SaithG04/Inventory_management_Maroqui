package ucv.app_inventory.order_service.application.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long supplierId;
    private String status;
    private List<OrderDetailDTO> orderDetails;
    private String observations;
    private String orderDate;
}