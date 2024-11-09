package ucv.app_inventory.order_service.application.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
}