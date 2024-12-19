package ucv.app_inventory.login.domain.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.domain.model.User;
import ucv.app_inventory.login.adapters.persistence.JpaUserRepository;

import java.util.Optional;

@Service
public class UserManagementService {

    private final JpaUserRepository userRepository;

    @Autowired
    public UserManagementService(JpaUserRepository userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Busca un usuario por su email y estado.
     * @param email Email del usuario.
     * @param status Estado del usuario.
     * @return Usuario encontrado o vacío si no existe.
     */
    public Optional<User> findByEmailAndStatus(String email, Status status) {
        return userRepository.findByEmailAndStatus(email, status);
    }
    /**
     * Busca un usuario por su email.
     * @param email Email del usuario.
     * @return Usuario encontrado o vacío si no existe.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    /**
     * Invalida el token de actualización de un usuario basado en su email.
     * @param email Email del usuario.
     */
    public void invalidateRefreshTokenByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        userOptional.ifPresent(user -> {
            user.setRefreshToken(null);
            userRepository.save(user);
        });
    }
}