package ucv.app_inventory.order_service.application.dto;

import lombok.Data;

@Data
public class ProveedorDTO {
    private Long id;
    private String nombre;
    private String contacto;
    private String email;
    private String telefono;
}
