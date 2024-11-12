package ucv.app_inventory.login.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class LogoutService {

    private final UserService usuarioService;

    @Autowired
    public LogoutService(UserService usuarioRepositorio) {
        this.usuarioService = usuarioRepositorio;
    }

    /**
     * Invalida el token de actualización del usuario.
     *
     * @param email del usuario para el que se desea realizar el logout.
     */
    public void logoutUser(String email) {
        if (usuarioService.findByEmail(email).isEmpty()) {
            throw new UsernameNotFoundException("Usuario no encontrado con el email: " + email);
        }
        usuarioService.invalidateRefreshTokenByEmail(email);
    }
}
