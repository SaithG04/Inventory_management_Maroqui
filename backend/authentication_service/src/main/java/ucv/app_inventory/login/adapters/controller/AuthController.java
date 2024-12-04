package ucv.app_inventory.login.adapters.controller;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ucv.app_inventory.login.adapters.controller.dto.ApiResponse;
import ucv.app_inventory.login.adapters.controller.dto.JwtResponse;
import ucv.app_inventory.login.adapters.controller.dto.LoginRequest;
import ucv.app_inventory.login.adapters.controller.dto.LogoutRequest;
import ucv.app_inventory.login.application.AuthService;
import ucv.app_inventory.login.domain.exception.InvalidCredentials;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.debug("Solicitud de autenticación recibida para el usuario: {}", loginRequest.getEmail());
        try {
            String token = authService.authenticateUser(loginRequest.getEmail(), loginRequest.getClave());
            logger.info("User autenticado: {}", loginRequest.getEmail());
            return ResponseEntity.ok(new ApiResponse<>("success", "Autenticación exitosa", new JwtResponse(token)));
        } catch (InvalidCredentials e) {
            logger.warn("Intento fallido de autenticación para el usuario: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>("error", e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Error inesperado durante la autenticación: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@Valid @RequestBody LogoutRequest logoutRequest) {
        String email = logoutRequest.getEmail();
        logger.info("Solicitud de logout recibida para el usuario: {}", email);
        try {
            authService.logoutUser(email);
            logger.info("User deslogueado: {}", email);
            return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>("success", "Logout exitoso", null));
        } catch (UsernameNotFoundException e) {
            logger.warn("Error de logout: User no encontrado: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>("error", "User no encontrado", null));
        } catch (Exception e) {
            logger.error("Error inesperado durante el logout para el usuario: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("error", "Error interno del servidor", null));
        }
    }
}
