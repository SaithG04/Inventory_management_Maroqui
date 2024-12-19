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

    public Optional<User> findByEmailAndStatus(String email, Status status) {
        return userRepository.findByEmailAndStatus(email, status);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void invalidateRefreshTokenByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        userOptional.ifPresent(user -> {
            user.setRefreshToken(null);
            userRepository.save(user);
        });
    }
}