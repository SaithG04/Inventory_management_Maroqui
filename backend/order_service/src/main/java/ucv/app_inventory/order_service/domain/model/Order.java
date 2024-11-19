package ucv.app_inventory.order_service.domain.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;  // Cambiar a LocalDateTime
import java.util.List;

/**
 * Represents an order in the system. Each order is associated with a supplier, a list of order details,
 * a status, a total amount, and additional observations. The order is automatically timestamped
 * upon creation.
 */
@Entity
@Table(name = "orders")
@Data
public class Order {

    // Unique identifier for each order, auto-generated.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Stores only the supplier's ID to associate the order with a specific supplier.
    @Column(name = "supplier_id", nullable = false)
    private Long supplierId;

    // Stores the date of the order; only the date part (without time).
    @Column(name = "date", nullable = false)
    private LocalDate orderDate;  // Cambiado a LocalDate para solo fecha

    // Stores the status of the order using an enumerated type for predefined states.
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderState status;

    // List of details for each order item; each detail is cascaded and loaded lazily.
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;

    // Total amount for the order.
    @Column(name = "total", nullable = false)
    private Double total;

    // Additional observations or notes about the order, if any.
    @Column(name = "observations")
    private String observations;

    // The date and time when the order was created, automatically set on creation.
    @Column(name = "creation_date", nullable = false)
    private LocalDateTime creationDate;  // Cambiado a LocalDateTime para incluir hora

    /**
     * Sets the date and creationDate fields to the current date and time when the order is created.
     * This method is automatically called before the entity is persisted.
     */
    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();  // Fecha y hora
    }
}