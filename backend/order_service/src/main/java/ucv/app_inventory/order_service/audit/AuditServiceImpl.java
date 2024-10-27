package ucv.app_inventory.order_service.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Servicio encargado de gestionar las operaciones de auditoría.
 */
@Service
public class AuditServiceImpl implements AuditService {

    private final AuditRepository auditRepository;

    @Autowired
    public AuditServiceImpl(AuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    /**
     * Registra un nuevo evento de auditoría en la base de datos.
     *
     * @param entidad La entidad afectada (Ej: Order, Cliente)
     * @param accion La acción realizada (Ej: CREAR, ACTUALIZAR, ELIMINAR)
     * @param usuario El nombre del usuario que realizó la acción
     * @param detalle Detalles adicionales del evento de auditoría
     */
    public void registrarAuditoria(String entidad, String accion, String usuario, String detalle) {
        Audit audit = new Audit(entidad, accion, usuario, detalle);
        auditRepository.save(audit); // Persistir el evento de auditoría
    }

    /**
     * Busca una auditoría por su ID.
     *
     * @param id El ID de la auditoría.
     * @return Un Optional con la auditoría si se encuentra, o un Optional vacío si no.
     */
    public Optional<Audit> buscarPorId(Long id) {
        return auditRepository.findById(id);
    }
}