package ucv.app_inventory.login.application;

import ucv.app_inventory.login.adapters.controller.dto.JwtResponse;
/**
 * Interfaz que define los métodos para la autenticación de usuarios.
 */
public interface AuthService {
    /**
     * Autentica un usuario y genera tokens de acceso y refresco.
     * @param email Email del usuario.
     * @param clave Contraseña del usuario.
     * @return Respuesta con tokens generados.
     */
    JwtResponse authenticateUser(String email, String clave);
    /**
     * Genera un nuevo token de acceso basado en un token de refresco válido.
     * @param refreshToken Token de refresco.
     * @return Respuesta con el nuevo token de acceso y de refresco.
     */
    JwtResponse refreshAccessToken(String refreshToken);
    /**
     * Cierra la sesión del usuario invalidando su token de refresco.
     * @param email Email del usuario.
     */
    void logoutUser(String email);
}
