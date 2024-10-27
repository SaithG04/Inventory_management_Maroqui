package ucv.app_inventory.order_service.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio de auditoría encargado de la persistencia de los eventos de auditoría en la base de datos.
 */
@Repository
public interface AuditRepository extends JpaRepository<Audit, Long> {

}
