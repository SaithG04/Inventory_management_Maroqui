package ucv.app_inventory.supplier_service.aspect;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ucv.app_inventory.supplier_service.audit.AuditService;
import ucv.app_inventory.supplier_service.infrastructure.outbound.external.UserAPIClient;

/**
 * Aspect for auditing actions on entities, such as creation, update, and deletion.
 * Automatically records audit logs based on method execution in the application layer.
 */
@Aspect
@Component
public class AuditAspect {

    private static final Logger logger = LoggerFactory.getLogger(AuditAspect.class);
    private final AuditService auditService;
    private final UserAPIClient userAPIClient;

    public AuditAspect(AuditService auditService, UserAPIClient userAPIClient) {
        this.auditService = auditService;
        this.userAPIClient = userAPIClient;
    }

    /**
     * Retrieves the username from the security context.
     *
     * @return The name of the authenticated user, or "Unknown User" if not authenticated.
     */
    public Long getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return -1L; // Returns a default value if no user is authenticated
        }
        String email = authentication.getName();
        return userAPIClient.getUserByEmail(email).getIdUser();
    }

    /**
     * Audits entity creation by logging the creation action, user, and created entity details.
     *
     * @param result the result of the method execution (the created entity).
     */
    @AfterReturning(value = "execution(* ucv.app_inventory.supplier_service.application.*.create*(..))", returning = "result")
    public void auditCreation(Object result) {
        Long user_id = getAuthenticatedUser();
        String entity = result.getClass().getSimpleName();
        logger.info("Recording audit for creation in entity: {}", entity);
        auditService.recordAudit(entity, "CREATE", user_id, result.toString());
    }

    /**
     * Audits entity updates by logging the update action, user, and updated entity details.
     *
     * @param result the result of the method execution (the updated entity).
     */
    @AfterReturning(value = "execution(* ucv.app_inventory.supplier_service.application.*.update*(..))", returning = "result")
    public void auditUpdate(Object result) {
        Long user_id = getAuthenticatedUser();
        String entity = result.getClass().getSimpleName();
        logger.info("Recording audit for update in entity: {}", entity);
        logInfo(user_id);
        auditService.recordAudit(entity, "UPDATE", user_id, result.toString());
    }

    private static void logInfo(Long user_id) {
        logger.info("Audit recorded for user ID: {}", user_id);
    }

    /**
     * Audits entity deletions by logging the deletion action, user, and ID of the deleted entity.
     *
     * @param joinPoint the join point for the delete method.
     */
    @Before("execution(* ucv.app_inventory.supplier_service.application.*.delete*(..))")
    public void auditDeletion(JoinPoint joinPoint) {
        Long user_id = getAuthenticatedUser();
        Object[] args = joinPoint.getArgs();
        Object entityToDelete = args[0];

        String entity = entityToDelete.getClass().getSimpleName();

        logger.info("Recording audit for deletion in entity: {}", entity);
        logInfo(user_id);

        auditService.recordAudit(entity, "DELETE", user_id, entityToDelete.toString());
    }
}
