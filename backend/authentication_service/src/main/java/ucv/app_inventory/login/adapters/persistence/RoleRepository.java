package ucv.app_inventory.login.adapters.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucv.app_inventory.login.domain.model.Role;
import java.util.Optional;
/**
 * Repositorio para la entidad Role, que extiende JpaRepository.
 * Proporciona métodos para interactuar con la base de datos de roles.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * Busca un rol por su nombre.
     * @param name Nombre del rol.
     * @return Rol encontrado, envuelto en un Optional.
     */
    Optional<Role> findByName(String name);
}
