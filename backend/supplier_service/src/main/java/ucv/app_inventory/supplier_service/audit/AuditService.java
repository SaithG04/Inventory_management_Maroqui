package ucv.app_inventory.supplier_service.audit;

/**
 * Interface for audit service, providing methods to log audit events in the database.
 */
public interface AuditService {

    /**
     * Records a new audit event in the database.
     *
     * @param entity  The affected entity (e.g., Supplier, User).
     * @param action  The action performed (e.g., CREATE, UPDATE, DELETE).
     * @param user_id The user performing the action.
     * @param details Additional details of the operation.
     */
    void recordAudit(String entity, String action, Long user_id, String details);
}