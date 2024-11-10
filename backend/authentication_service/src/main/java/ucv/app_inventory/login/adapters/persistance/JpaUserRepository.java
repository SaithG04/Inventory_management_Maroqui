package ucv.app_inventory.login.adapters.persistance;

import ucv.app_inventory.login.domain.model.Usuario;
import ucv.app_inventory.login.domain.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface JpaUserRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByStatus(Status status);

    List<Usuario> findByFullname(String fullname);

    List<Usuario> findByRoles_Name(String name);

    long countByStatus(Status status);

    Optional<Usuario> findByEmailAndStatus(String email, Status status);

    List<Usuario> findByCreatedAtAfter(LocalDateTime date);

    @Modifying
    @Transactional
    @Query("update Usuario u set u.refreshToken = null where u.email = ?1")
    void invalidateRefreshTokenByEmail(String email);
}
