package ucv.app_inventory.login.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service responsible for managing audit operations.
 */
@Service
public class AuditServiceImpl implements AuditService {

    private final AuditRepository auditRepository;

    @Autowired
    public AuditServiceImpl(AuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    /**
     * Records a new audit event in the database.
     *
     * @param entity  The affected entity (e.g., Supplier, Customer).
     * @param action  The action performed (e.g., CREATE, UPDATE, DELETE).
     * @param user_id  The ID of the user who performed the action.
     * @param details Additional details of the audit event.
     */
    @Override
    public void recordAudit(String entity, String action, Long user_id, String details) {
        Audit audit = new Audit(entity, action, user_id, details);
        auditRepository.save(audit); // Persist the audit event
    }

    /**
     * Finds an audit record by its ID.
     *
     * @param id The ID of the audit record.
     * @return An Optional containing the audit record if found, or an empty Optional if not.
     */
    public Optional<Audit> findById(Long id) {
        return auditRepository.findById(id);
    }
}