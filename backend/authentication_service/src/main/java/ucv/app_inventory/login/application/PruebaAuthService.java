package ucv.app_inventory.login.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.domain.model.User;
import ucv.app_inventory.login.adapters.auth.CustomUserDetails;
import ucv.app_inventory.login.domain.model.Status;

@Service
public class PruebaAuthService {

    private final UserService userService;

    @Autowired
    public PruebaAuthService(UserService userService) {
        this.userService = userService;
    }

    public UserDetails authenticateUser(String email) {
        User user = userService.findByEmailAndStatus(email, Status.ACTIVE)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado o no activo"));

        return new CustomUserDetails(user);
    }
}
