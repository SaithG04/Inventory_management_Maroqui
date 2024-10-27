package ucv.app_inventory.login.adapters.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa una solicitud de autenticación basada en un token JWT.
 *
 * Se utiliza para encapsular el token JWT enviado en solicitudes de
 * autenticación o validación de usuarios.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtRequest {

    /**
     * Token JWT que se envía en la solicitud.
     */
    private String token;
}
