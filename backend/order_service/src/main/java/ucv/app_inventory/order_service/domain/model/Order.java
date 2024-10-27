package ucv.app_inventory.order_service.domain.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Almacenar solo el ID del proveedor
    @Column(name = "proveedor_id", nullable = false)
    private Long proveedorId;

    @Column(name = "fecha", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private OrderState estado;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private List<OrderDetail> orderDetails;

    @Column(name = "total", nullable = false)
    private Double total;

    @Column(name = "observaciones")
    private String observaciones;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fecha = new Date();
        this.fechaCreacion = LocalDate.now(); // Asignar la fecha actual
    }
}
