package ucv.app_inventory.order_service.application.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PedidoDTO {

    private Long id;
    private String cliente;
    private LocalDate fecha;
    private String estado;
    private List<DetallePedidoDTO> detallePedidos;

}
