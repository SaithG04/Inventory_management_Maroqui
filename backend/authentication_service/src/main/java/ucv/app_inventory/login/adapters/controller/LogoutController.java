package ucv.app_inventory.login.adapters.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ucv.app_inventory.login.application.LogoutService;
import ucv.app_inventory.login.adapters.controller.dto.ApiResponse;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import ucv.app_inventory.login.adapters.controller.dto.LogoutRequest;

@RestController
@RequestMapping("/api/auth")
public class LogoutController {

    private static final Logger logger = LoggerFactory.getLogger(LogoutController.class);
    private final LogoutService logoutUserService;

    public LogoutController(LogoutService logoutUserService) {
        this.logoutUserService = logoutUserService;
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@Valid @RequestBody LogoutRequest logoutRequest) {
        String email = logoutRequest.getEmail();
        logger.info("Solicitud de logout recibida para el usuario: {}", email);
        try {
            logoutUserService.logoutUser(email);
            logger.info("Usuario deslogueado: {}", email);
            return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>("success", "Logout exitoso", null));
        } catch (UsernameNotFoundException e) {
            logger.warn("Error de logout: Usuario no encontrado: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>("error", "Usuario no encontrado", null));
        } catch (Exception e) {
            logger.error("Error inesperado durante el logout para el usuario: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("error", "Error interno del servidor", null));
        }
    }
}
