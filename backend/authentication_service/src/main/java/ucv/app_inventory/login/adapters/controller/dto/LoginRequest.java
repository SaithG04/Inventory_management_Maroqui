/**
 * Representa una solicitud de inicio de sesión.
 */
package ucv.app_inventory.login.adapters.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe proporcionar un email válido")
    private String email; // Email del usuario.

    @NotBlank(message = "La contraseña es obligatoria")
    private String clave; // Contraseña del usuario.
}
