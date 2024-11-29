package ucv.app_inventory.login.adapters.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.domain.model.User;
import ucv.app_inventory.login.domain.model.Role;

import java.util.Collection;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convertir los roles del usuario a SimpleGrantedAuthority
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return user.getPassword(); // Devuelve la contraseña del usuario
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // Devuelve el email como el "username"
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Se puede implementar lógica adicional según el caso
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.getStatus() == Status.ACTIVE; // Solo activo
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Se puede implementar lógica adicional según el caso
    }

    @Override
    public boolean isEnabled() {
        return user.getStatus() == Status.ACTIVE; // Solo activo
    }

    // Métodos adicionales
    public User getUser() {
        return user;
    }
}
