package ucv.app_inventory.login.domain.repository;

import ucv.app_inventory.login.domain.model.Usuario;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

public interface IUsuarioRepositorio {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByStatus(String status);

    List<Usuario> findByFullname(String fullname);

    List<Usuario> findByRole(String role);

    long countByStatus(String status);

    Optional<Usuario> findByEmailAndStatus(String email, String status);

    List<Usuario> findByCreatedAtAfter(LocalDateTime date);
}
