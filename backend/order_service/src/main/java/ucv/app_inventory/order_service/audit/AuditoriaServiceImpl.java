package ucv.app_inventory.order_service.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Servicio encargado de gestionar las operaciones de auditoría.
 */
@Service
public class AuditoriaServiceImpl implements AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    @Autowired
    public AuditoriaServiceImpl(AuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    /**
     * Registra un nuevo evento de auditoría en la base de datos.
     *
     * @param entidad La entidad afectada (Ej: Pedido, Cliente)
     * @param accion La acción realizada (Ej: CREAR, ACTUALIZAR, ELIMINAR)
     * @param usuario El nombre del usuario que realizó la acción
     * @param detalle Detalles adicionales del evento de auditoría
     */
    public void registrarAuditoria(String entidad, String accion, String usuario, String detalle) {
        Auditoria auditoria = new Auditoria(entidad, accion, usuario, detalle);
        auditoriaRepository.save(auditoria); // Persistir el evento de auditoría
    }

    /**
     * Busca una auditoría por su ID.
     *
     * @param id El ID de la auditoría.
     * @return Un Optional con la auditoría si se encuentra, o un Optional vacío si no.
     */
    public Optional<Auditoria> buscarPorId(Long id) {
        return auditoriaRepository.findById(id);
    }
}