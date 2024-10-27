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
import ucv.app_inventory.login.domain.exceptions.CredencialesInvalidas;

/**
 * Controlador REST para manejar la autenticación de usuarios.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class ControllerLogin {

    private static final Logger logger = LoggerFactory.getLogger(ControllerLogin.class);

    private final AuthUser autenticacionUsuario;

    public ControllerLogin(AuthUser autenticacionUsuario) {
        this.autenticacionUsuario = autenticacionUsuario;
    }

    /**
     * Autentica al usuario y devuelve un token JWT.
     *
     * @param loginRequest Objeto que contiene las credenciales del usuario.
     * @return ResponseEntity con el token JWT o un mensaje de error.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            String token = autenticacionUsuario.autenticarUsuario(loginRequest.getEmail(), loginRequest.getClave());
            logger.info("Usuario autenticado: {}", loginRequest.getEmail());
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (CredencialesInvalidas e) {
            logger.error("Error de autenticación: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
        }
    }
}
