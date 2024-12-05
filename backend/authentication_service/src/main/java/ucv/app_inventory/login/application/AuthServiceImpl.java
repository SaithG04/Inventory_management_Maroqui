package ucv.app_inventory.login.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.domain.auth.TokenManagementService;
import ucv.app_inventory.login.domain.exception.InvalidCredentials;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.domain.model.User;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final TokenManagementService tokenManagementService;
    private final UserService userService;

    @Autowired
    public AuthServiceImpl(AuthenticationManager authenticationManager, TokenManagementService tokenManagementService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.tokenManagementService = tokenManagementService;
        this.userService = userService;
    }

    @Override
    public String authenticateUser(String email, String password) {
        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
            throw new IllegalArgumentException("El nombre de usuario y la contraseña no deben estar vacíos");
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

            User user = userService.findByEmailAndStatus(email, Status.ACTIVE)
                    .orElseThrow(() -> new InvalidCredentials("Usuario no encontrado o no activo"));

            return tokenManagementService.generateToken(user);

        } catch (AuthenticationException e) {
            throw new InvalidCredentials("Usuario o contraseña incorrectos");
        }
    }

    @Override
    public void logoutUser(String email) {
        if (userService.findByEmail(email).isEmpty()) {
            throw new InvalidCredentials("Usuario no encontrado con el email: " + email);
        }
        userService.invalidateRefreshTokenByEmail(email);
    }
}
