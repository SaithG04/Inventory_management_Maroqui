package ucv.app_inventory.order_service.aspect;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ucv.app_inventory.order_service.audit.AuditoriaServiceImpl;
import ucv.app_inventory.order_service.domain.Pedido;

@Aspect
@Component
public class AuditoriaAspect {

    private static final Logger logger = LoggerFactory.getLogger(AuditoriaAspect.class);
    private final AuditoriaServiceImpl auditoriaServiceImpl;

    public AuditoriaAspect(AuditoriaServiceImpl auditoriaServiceImpl) {
        this.auditoriaServiceImpl = auditoriaServiceImpl;
    }

    /**
     * Obtiene el nombre de usuario desde el contexto de seguridad.
     *
     * @return El nombre del usuario autenticado, o "defaultUser" si no está autenticado.
     */
    public String obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "Usuario desconocido"; // Devuelve un valor por defecto si no hay usuario autenticado
        }
        return authentication.getName(); // O getPrincipal() si es necesario obtener más información
    }

    @AfterReturning(value = "execution(* ucv.app_inventory.order_service.application.service.*.crear*(..))", returning = "result")
    public void auditarCreacion(JoinPoint joinPoint, Object result) {
        String usuario = obtenerUsuarioAutenticado();
        String entidad = result.getClass().getSimpleName();
        logger.info("Registrando auditoría para creación en la entidad: {}", entidad);
        auditoriaServiceImpl.registrarAuditoria(entidad, "CREAR", usuario, result.toString());
    }

    @AfterReturning(value = "execution(* ucv.app_inventory.order_service.application.service.*.actualizar*(..))", returning = "result")
    public void auditarActualizacion(JoinPoint joinPoint, Object result) {

        String usuario = obtenerUsuarioAutenticado();
        String entidad = result.getClass().getSimpleName();
        logger.info("Registrando auditoría para actualización en la entidad: {}", entidad);
        logger.info("Auditoría registrada para el usuario: " + usuario);
        auditoriaServiceImpl.registrarAuditoria(entidad, "ACTUALIZAR", usuario, result.toString());
    }

    @Before("execution(* ucv.app_inventory.order_service.application.service.*.eliminar*(..))")
    public void auditarEliminacion(JoinPoint joinPoint) {
        String entidad = joinPoint.getSignature().getDeclaringTypeName();
        String usuario = obtenerUsuarioAutenticado();
        Object[] args = joinPoint.getArgs();
        logger.info("Registrando auditoría para eliminación en la entidad: {}", entidad);
        auditoriaServiceImpl.registrarAuditoria(entidad, "ELIMINAR", usuario, "ID eliminado: " + args[0]);
    }
}
