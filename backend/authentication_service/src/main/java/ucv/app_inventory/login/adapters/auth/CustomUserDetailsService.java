package ucv.app_inventory.login.adapters.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.adapters.persistence.JpaUserRepository;
import ucv.app_inventory.login.domain.model.Status;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final JpaUserRepository jpaUserRepository;

    @Autowired
    public CustomUserDetailsService(JpaUserRepository jpaUserRepository) {
        this.jpaUserRepository = jpaUserRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscar al usuario activo por su email
        ucv.app_inventory.login.domain.model.User user = jpaUserRepository.findByEmailAndStatus(email, Status.ACTIVE)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado o no activo"));

        // Convertir roles en una colección de GrantedAuthority
        Set<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))  // Asumiendo que 'getName' devuelve el nombre del rol
                .collect(Collectors.toSet());

        // Crear el objeto UserDetails con los roles mapeados a GrantedAuthority
        return User.builder()
                .username(user.getEmail())  // Usamos el email como el nombre de usuario
                .password(user.getPassword())  // Contraseña del usuario
                .authorities(authorities)  // Establecer las autoridades (roles)
                .build();
    }
}
