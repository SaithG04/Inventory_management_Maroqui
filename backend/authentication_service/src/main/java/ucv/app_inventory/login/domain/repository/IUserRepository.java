package ucv.app_inventory.login.domain.repository;

import ucv.app_inventory.login.domain.model.Usuario;
import ucv.app_inventory.login.domain.model.Status;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

public interface IUserRepository {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByStatus(Status status);

    List<Usuario> findByFullname(String fullname);

    List<Usuario> findByRoles_Name(String name);

    long countByStatus(Status status);

    Optional<Usuario> findByEmailAndStatus(String email, Status status);

    List<Usuario> findByCreatedAtAfter(LocalDateTime date);

    void invalidateRefreshTokenByEmail(String email);
}
