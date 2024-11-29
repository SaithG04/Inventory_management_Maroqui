package ucv.app_inventory.login.adapters.controller.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetailException {

    private String mensaje;
    private String detalles;
}