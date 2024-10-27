package ucv.app_inventory.login.adapters.persistance;

import ucv.app_inventory.login.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;

public interface JpaUserRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByStatus(String status);

    List<Usuario> findByFullname(String fullname);

    List<Usuario> findByRole(String role);

    long countByStatus(String status);

    Optional<Usuario> findByEmailAndStatus(String email, String status);

    List<Usuario> findByCreatedAtAfter(LocalDateTime date);
}
