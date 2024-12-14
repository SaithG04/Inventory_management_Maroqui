package ucv.app_inventory.order_service.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import feign.FeignException;
import lombok.Data;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProductAPIClient;
import ucv.app_inventory.order_service.infrastructure.outbound.external.SupplierAPIClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private Double total;
    private LocalDateTime createdAt;
}