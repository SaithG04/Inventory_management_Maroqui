package ucv.app_inventory.login.application;

import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.adapters.controller.dto.JwtResponse;
import ucv.app_inventory.login.adapters.persistance.JpaUserRepository;
import ucv.app_inventory.login.domain.auth.TokenManagementService;
import ucv.app_inventory.login.domain.exception.InvalidCredentials;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.domain.model.User;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final TokenManagementService tokenManagementService;
    private final UserService userService;
    private final JpaUserRepository userRepository;

    @Autowired
    public AuthServiceImpl(AuthenticationManager authenticationManager, TokenManagementService tokenManagementService, UserService userService, JpaUserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenManagementService = tokenManagementService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @Override
    public JwtResponse authenticateUser(String email, String password) {
        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
            throw new IllegalArgumentException("El email y la contraseña no deben estar vacíos");
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

            User user = userRepository.findByEmailAndStatus(email, Status.ACTIVE)
                    .orElseThrow(() -> new InvalidCredentials("Usuario no encontrado o no activo"));

            String accessToken = tokenManagementService.generateToken(user);
            String refreshToken = tokenManagementService.generateRefreshToken(user);

            user.setRefreshToken(refreshToken);
            userRepository.save(user);

            return new JwtResponse(accessToken, refreshToken);

        } catch (AuthenticationException e) {
            throw new InvalidCredentials("Usuario o contraseña incorrectos");
        }
    }

    @Override
    public JwtResponse refreshAccessToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new InvalidCredentials("Refresh token no proporcionado");
        }
        // Validar el refresh token
        try {
            tokenManagementService.validarToken(refreshToken);
            String email = tokenManagementService.getUsuarioToken(refreshToken);

            User user = userRepository.findByEmailAndStatus(email, Status.ACTIVE)
                    .orElseThrow(() -> new InvalidCredentials("Usuario no encontrado o no activo"));

            if (!refreshToken.equals(user.getRefreshToken())) {
                throw new InvalidCredentials("Refresh token no válido");
            }

            String newAccessToken = tokenManagementService.generateToken(user);
            String newRefreshToken = tokenManagementService.generateRefreshToken(user);
            user.setRefreshToken(newRefreshToken);
            userRepository.save(user);

            return new JwtResponse(newAccessToken, newRefreshToken);

        } catch (JwtException e) {
            throw new InvalidCredentials("Refresh token inválido o expirado");
        }
    }

    @Override
    public void logoutUser(String email) {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("El email no debe estar vacío");
        }

        User user = userRepository.findByEmailAndStatus(email, Status.ACTIVE)
                .orElseThrow(() -> new InvalidCredentials("Usuario no encontrado o no activo"));

        user.setRefreshToken(null);
        userRepository.save(user);
    }
}
