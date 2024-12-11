package ucv.app_inventory.login.adapters.persistence;

import org.springframework.stereotype.Repository;
import ucv.app_inventory.login.domain.model.User;
import ucv.app_inventory.login.domain.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface JpaUserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByStatus(Status status);

    List<User> findByRoles_Name(String name);

    long countByStatus(Status status);

    Optional<User> findByEmailAndStatus(String email, Status status);

    List<User> findByCreatedAtAfter(LocalDateTime date);

    Optional<User> findByRefreshToken(String refreshToken);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.refreshToken = null WHERE u.email = ?1")
    void invalidateRefreshTokenByEmail(String email);
}
