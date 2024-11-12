package ucv.app_inventory.login.adapters.auth;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.domain.model.User;
import ucv.app_inventory.login.domain.model.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ucv.app_inventory.login.application.UserService;

/**
 * Servicio que implementa UsuarioDetailsService para cargar los detalles del
 usuario para la autenticación.
 */
@Service
public class UsuarioDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsService.class);

    private final UserService usuarioService;

    public UsuarioDetailsService(UserService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Override
    public User loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Intentando cargar el user con email: {}", email);

        User user = usuarioService.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User no encontrado con email: {}", email);
                    return new UsernameNotFoundException("User no encontrado");
                });

        if (user.getStatus() != Status.ACTIVE) {
            logger.warn("User con email {} no está activo", email);
            throw new UsernameNotFoundException("User no activo");
        }

        logger.debug("User encontrado y activo: {}", email);
        
        return user;
    }
}
