package ucv.app_inventory.order_service.audit;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad que representa un evento de auditoría, almacenando detalles importantes como
 * la entidad afectada, el tipo de acción, el usuario que realiza la acción, y detalles adicionales.
 */
@Entity
@Table(name = "auditorias")
@Data
@NoArgsConstructor  // Constructor sin argumentos requerido por JPA
@AllArgsConstructor  // Constructor con todos los campos
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entidad", nullable = false)
    private String entidad;  // Ejemplo: Pedido, Cliente, etc.

    @Column(name = "tipo_accion", nullable = false)
    private String tipoAccion;  // Ejemplo: CREAR, ACTUALIZAR, ELIMINAR

    @Column(name = "usuario", nullable = false)
    private String usuario;  // Usuario que realiza la acción

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;  // Fecha y hora del evento

    @Column(name = "detalle", nullable = true)
    private String detalle;  // Detalles adicionales sobre el cambio

    /**
     * Constructor adicional para facilitar la creación de objetos Auditoria con los campos clave.
     * @param entidad La entidad afectada por la acción (Ej. Pedido, Cliente)
     * @param tipoAccion El tipo de acción que se realizó (Ej. CREAR, ACTUALIZAR, ELIMINAR)
     * @param usuario El nombre del usuario que realizó la acción
     * @param detalle Detalles adicionales del evento (opcional)
     */
    public Auditoria(String entidad, String tipoAccion, String usuario, String detalle) {
        this.entidad = entidad;
        this.tipoAccion = tipoAccion;
        this.usuario = usuario;
        this.detalle = detalle;
        this.fechaHora = LocalDateTime.now();  // Se registra la fecha y hora actual
    }
}