package ucv.app_inventory.login.application;

import ucv.app_inventory.login.domain.auth.TokenManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.domain.exception.CredencialesInvalidas;
import ucv.app_inventory.login.domain.model.Usuario;
import ucv.app_inventory.login.domain.model.Status;

@Service
public class AuthUser {

    private final AuthenticationManager authenticationManager;
    private final TokenManagementService jwtTokenUsuario;
    private final UserService userService;

    @Autowired
    public AuthUser(AuthenticationManager authenticationManager, TokenManagementService jwtTokenUsuario, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenUsuario = jwtTokenUsuario;
        this.userService = userService;
    }

    public String autenticarUsuario(String email, String clave) {
        if (email == null || clave == null || email.isEmpty() || clave.isEmpty()) {
            throw new IllegalArgumentException("El nombre de usuario y la contraseña no deben estar vacíos");
        }
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, clave));

            Usuario usuario = userService.findByEmailAndStatus(email, Status.ACTIVE)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado o no activo"));

            return jwtTokenUsuario.generarToken(usuario);

        } catch (AuthenticationException e) {
            throw new CredencialesInvalidas("Usuario o contraseña incorrectos");
        }
    }
}
