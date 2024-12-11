package ucv.app_inventory.login.adapters.controller.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa una solicitud de cierre de sesión para un usuario.
 *
 * Se utiliza para encapsular el email del usuario que desea cerrar sesión.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogoutRequest {

    /**
     * Email del usuario que solicita el cierre de sesión.
     */
    @NotBlank(message = "El email es obligatorio")
    private String email;
}
