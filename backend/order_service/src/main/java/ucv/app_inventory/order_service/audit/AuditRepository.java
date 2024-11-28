package ucv.app_inventory.order_service.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Audit repository responsible for persisting audit events in the database.
 */
@Repository
public interface AuditRepository extends JpaRepository<Audit, Long> {

}
