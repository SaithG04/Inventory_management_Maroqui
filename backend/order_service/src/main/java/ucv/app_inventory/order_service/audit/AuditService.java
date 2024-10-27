package ucv.app_inventory.order_service.audit;

public interface AuditService {

    /**
     * Registra un nuevo evento de auditoría en la base de datos.
     *
     * @param entidad La entidad afectada (ej. Order, Usuario).
     * @param accion  La acción realizada (ej. CREAR, ACTUALIZAR, ELIMINAR).
     * @param usuario El usuario que realiza la acción.
     * @param detalle Los detalles adicionales de la operación.
     */
    void registrarAuditoria(String entidad, String accion, String usuario, String detalle);
}