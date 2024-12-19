/**
 * Representa una respuesta que contiene tokens JWT para autenticación.
 */
package ucv.app_inventory.login.adapters.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String accessToken; // Token de acceso JWT.
    private String refreshToken; // Token de renovación JWT.
}
