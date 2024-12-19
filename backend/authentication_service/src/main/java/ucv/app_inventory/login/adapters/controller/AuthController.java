package ucv.app_inventory.login.adapters.controller;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ucv.app_inventory.login.adapters.controller.dto.*;
import ucv.app_inventory.login.application.AuthService;
import ucv.app_inventory.login.domain.auth.TokenManagementService;
import ucv.app_inventory.login.domain.auth.TokenRevocationService;
import ucv.app_inventory.login.domain.exception.InvalidCredentials;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;
    @Autowired
    private TokenManagementService tokenManagementService;
    @Autowired
    private TokenRevocationService tokenRevocationService;

    // Endpoint de login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.debug("Solicitud de autenticación recibida para el usuario: {}", loginRequest.getEmail());
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest.getEmail(), loginRequest.getClave());
            logger.info("Usuario autenticado: {}", loginRequest.getEmail());
            return ResponseEntity.ok(new ApiResponse<>("success", "Autenticación exitosa", jwtResponse));
        } catch (InvalidCredentials e) {
            logger.warn("Intento fallido de autenticación para el usuario: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>("error", e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Error inesperado durante la autenticación: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("error", e.getMessage(), null));
        }
    }

    // Endpoint para renovar el access token
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(@RequestBody JwtRequest jwtRequest) {
        try {
            JwtResponse jwtResponse = authService.refreshAccessToken(jwtRequest.getToken());
            return ResponseEntity.ok(new ApiResponse<>("success", "Access token renovado", jwtResponse));
        } catch (InvalidCredentials e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>("error", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>("error", "Refresh token inválido o expirado", null));
        }
    }

    // Endpoint de logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestBody JwtRequest jwtRequest) {
        String refreshToken = jwtRequest.getToken();
        logger.info("Solicitud de logout recibida para el refresh token: {}", refreshToken);
        try {
            // Validar y obtener el email del refresh token
            tokenManagementService.validarToken(refreshToken);
            String email = tokenManagementService.getUsuarioToken(refreshToken);

            // Revocar el refresh token
            authService.logoutUser(email);
            tokenRevocationService.revokeToken(refreshToken);

            logger.info("Usuario deslogueado: {}", email);
            return ResponseEntity.ok(new ApiResponse<>("success", "Logout exitoso", null));
        } catch (InvalidCredentials e) {
            logger.warn("Error de logout: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>("error", e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Error inesperado durante el logout", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>("error", "Error interno del servidor", null));
        }
    }
}
