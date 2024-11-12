package ucv.app_inventory.login.adapters.auth;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.domain.model.Usuario;
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
    public Usuario loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Intentando cargar el usuario con email: {}", email);

        Usuario usuario = usuarioService.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Usuario no encontrado con email: {}", email);
                    return new UsernameNotFoundException("Usuario no encontrado");
                });

        if (usuario.getStatus() != Status.ACTIVE) {
            logger.warn("Usuario con email {} no está activo", email);
            throw new UsernameNotFoundException("Usuario no activo");
        }

        logger.debug("Usuario encontrado y activo: {}", email);
        
        return usuario;
    }
}
