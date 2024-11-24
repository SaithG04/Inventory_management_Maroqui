package ucv.app_inventory.order_service.aspect;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ucv.app_inventory.order_service.audit.AuditService;

/**
 * Aspect for auditing actions on entities, such as creation, update, and deletion.
 * Automatically records audit logs based on method execution in the application layer.
 */
@Aspect
@Component
public class AuditAspect {

    private static final Logger logger = LoggerFactory.getLogger(AuditAspect.class);
    private final AuditService auditService;

    public AuditAspect(AuditService auditService) {
        this.auditService = auditService;
    }

    /**
     * Retrieves the username from the security context.
     *
     * @return The name of the authenticated user, or "Unknown User" if not authenticated.
     */
    public String getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "Unknown User"; // Returns a default value if no user is authenticated
        }
        return authentication.getName(); // Use getPrincipal() if more information is needed
    }

    /**
     * Audits entity creation by logging the creation action, user, and created entity details.
     *
     * @param joinPoint the join point for the creation method.
     * @param result    the result of the method execution (the created entity).
     */
    @AfterReturning(value = "execution(* ucv.app_inventory.order_service.application.*.create*(..))", returning = "result")
    public void auditCreation(JoinPoint joinPoint, Object result) {
        String user = getAuthenticatedUser();
        String entity = result.getClass().getSimpleName();
        logger.info("Recording audit for creation in entity: {}", entity);
        auditService.recordAudit(entity, "CREATE", user, result.toString());
    }

    /**
     * Audits entity updates by logging the update action, user, and updated entity details.
     *
     * @param joinPoint the join point for the update method.
     * @param result    the result of the method execution (the updated entity).
     */
    @AfterReturning(value = "execution(* ucv.app_inventory.order_service.application.*.update*(..))", returning = "result")
    public void auditUpdate(JoinPoint joinPoint, Object result) {
        String user = getAuthenticatedUser();
        String entity = result.getClass().getSimpleName();
        logger.info("Recording audit for update in entity: {}", entity);
        logger.info("Audit recorded for user: {}", user);
        auditService.recordAudit(entity, "UPDATE", user, result.toString());
    }

    /**
     * Audits entity deletions by logging the deletion action, user, and ID of the deleted entity.
     *
     * @param joinPoint the join point for the delete method.
     */
    @Before("execution(* ucv.app_inventory.order_service.application.*.delete*(..))")
    public void auditDeletion(JoinPoint joinPoint) {
        String entity = joinPoint.getSignature().getDeclaringTypeName();
        String user = getAuthenticatedUser();
        Object[] args = joinPoint.getArgs();
        logger.info("Recording audit for deletion in entity: {}", entity);
        auditService.recordAudit(entity, "DELETE", user, "Deleted ID: " + args[0]);
    }
}