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

/**
 * Repositorio para la entidad User, que extiende JpaRepository.
 * Proporciona métodos para interactuar con la base de datos de usuarios.
 */
@Repository
public interface JpaUserRepository extends JpaRepository<User, Long> {
    /**
     * Busca un usuario por su email.
     * @param email Email del usuario.
     * @return Usuario encontrado, envuelto en un Optional.
     */
    Optional<User> findByEmail(String email);
    /**
     * Busca usuarios por su estado (activo/inactivo).
     * @param status Estado del usuario.
     * @return Lista de usuarios con el estado especificado.
     */
    List<User> findByStatus(Status status);
    /**
     * Busca usuarios por nombre de rol.
     * @param name Nombre del rol.
     * @return Lista de usuarios que tienen el rol especificado.
     */
    List<User> findByRoles_Name(String name);
    /**
     * Cuenta los usuarios por su estado.
     * @param status Estado del usuario.
     * @return Número de usuarios con el estado especificado.
     */
    long countByStatus(Status status);
    /**
     * Busca un usuario por su email y estado.
     * @param email Email del usuario.
     * @param status Estado del usuario.
     * @return Usuario encontrado, envuelto en un Optional.
     */
    Optional<User> findByEmailAndStatus(String email, Status status);
    /**
     * Busca usuarios creados después de una fecha específica.
     * @param date Fecha límite.
     * @return Lista de usuarios creados después de la fecha especificada.
     */
    List<User> findByCreatedAtAfter(LocalDateTime date);
    /**
     * Busca un usuario por su refresh token.
     * @param refreshToken Token de refresco.
     * @return Usuario encontrado, envuelto en un Optional.
     */
    Optional<User> findByRefreshToken(String refreshToken);
    /**
     * Invalida el refresh token de un usuario basado en su email.
     * @param email Email del usuario.
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.refreshToken = null WHERE u.email = ?1")
    void invalidateRefreshTokenByEmail(String email);
}
