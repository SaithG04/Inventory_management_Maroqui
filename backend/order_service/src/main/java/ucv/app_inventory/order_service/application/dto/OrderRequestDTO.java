package ucv.app_inventory.order_service.application.dto;

import jakarta.validation.Valid;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {
    @Valid
    private OrderDTO order;

    @Valid
    private List<OrderDetailDTO> orderDetails;
}
