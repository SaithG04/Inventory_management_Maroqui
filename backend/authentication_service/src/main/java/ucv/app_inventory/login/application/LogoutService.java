package ucv.app_inventory.login.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.domain.repository.IUserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class LogoutService {

    private final IUserRepository usuarioRepositorio;

    @Autowired
    public LogoutService(IUserRepository usuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    /**
     * Invalida el token de actualización del usuario.
     *
     * @param email del usuario para el que se desea realizar el logout.
     */
    public void logoutUser(String email) {
        if (usuarioRepositorio.findByEmail(email).isEmpty()) {
            throw new UsernameNotFoundException("Usuario no encontrado con el email: " + email);
        }
        usuarioRepositorio.invalidateRefreshTokenByEmail(email);
    }
}
