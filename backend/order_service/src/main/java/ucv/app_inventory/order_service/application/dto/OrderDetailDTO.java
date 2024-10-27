package ucv.app_inventory.order_service.application.dto;

import lombok.Data;

@Data
public class OrderDetailDTO {

    private Long id;
    private String producto;
    private Integer cantidad;
    private Double precioUnitario;

}
