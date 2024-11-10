package ucv.app_inventory.login.adapters.controller;

import ucv.app_inventory.login.application.AuthUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ucv.app_inventory.login.adapters.controller.dto.JwtResponse;
import ucv.app_inventory.login.adapters.controller.dto.LoginRequest;
import ucv.app_inventory.login.domain.exception.CredencialesInvalidas;
import ucv.app_inventory.login.adapters.controller.dto.ApiResponse;

@RestController
@RequestMapping("/api/v1/auth")
public class LoginController {

    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    private final AuthUser autenticacionUsuario;

    public LoginController(AuthUser autenticacionUsuario) {
        this.autenticacionUsuario = autenticacionUsuario;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.debug("Solicitud de autenticación recibida para el usuario: {}", loginRequest.getEmail());
        try {
            String token = autenticacionUsuario.autenticarUsuario(loginRequest.getEmail(), loginRequest.getClave());
            logger.info("Usuario autenticado: {}", loginRequest.getEmail());
            return ResponseEntity.ok(new ApiResponse<>("success", "Autenticación exitosa", new JwtResponse(token)));
        } catch (CredencialesInvalidas e) {
            logger.warn("Intento fallido de autenticación para el usuario: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>("error", "Usuario o contraseña incorrectos", null));
        } catch (Exception e) {
            logger.error("Error inesperado durante la autenticación: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("error", "Error interno del servidor", null));
        }
    }
}