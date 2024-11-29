package ucv.app_inventory.login.adapters.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.domain.model.User;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.application.UserService;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UserService userService;

    @Autowired
    public UsuarioDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userService.findByEmailAndStatus(email, Status.ACTIVE)
                .map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado o no activo"));
    }
}
