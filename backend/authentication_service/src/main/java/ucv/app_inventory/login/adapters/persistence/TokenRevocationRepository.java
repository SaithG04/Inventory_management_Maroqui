package ucv.app_inventory.login.adapters.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucv.app_inventory.login.domain.model.RevokedToken;
/**
 * Repositorio para la entidad RevokedToken, que extiende JpaRepository.
 * Proporciona métodos para interactuar con tokens revocados en la base de datos.
 */
@Repository
public interface TokenRevocationRepository extends JpaRepository<RevokedToken, Long> {
    /**
     * Verifica si un token está revocado.
     * @param token Token a verificar.
     * @return true si el token está revocado, false en caso contrario.
     */
    boolean existsByToken(String token);
}
