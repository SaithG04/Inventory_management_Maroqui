package ucv.app_inventory.login.adapters.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucv.app_inventory.login.domain.model.RevokedToken;

@Repository
public interface TokenRevocationRepository extends JpaRepository<RevokedToken, Long> {
    boolean existsByToken(String token);
}
