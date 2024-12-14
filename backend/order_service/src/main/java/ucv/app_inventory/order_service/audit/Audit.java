package ucv.app_inventory.order_service.audit;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing an audit event, storing key details such as the affected entity,
 * action type, user performing the action, and additional details.
 */
@Entity
@Table(name = "audits")
@Data
@NoArgsConstructor  // No-args constructor required by JPA
@AllArgsConstructor  // Constructor with all fields
public class Audit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity", nullable = false)
    private String entity;  // Example: Supplier, Customer, etc.

    @Column(name = "action_type", nullable = false)
    private String actionType;  // Example: CREATE, UPDATE, DELETE

    @Column(name = "user_id", nullable = false)
    private Long user_id;  // User performing the action

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;  // Date and time of the event

    @Column(name = "details", nullable = false)
    @Lob
    private String details;  // Additional details about the change

    /**
     * Additional constructor to facilitate creating Audit objects with key fields.
     * @param entity The entity affected by the action (e.g., Supplier, Customer)
     * @param actionType The type of action performed (e.g., CREATE, UPDATE, DELETE)
     * @param user_id The ID of the user who performed the action
     * @param details Additional details of the event (optional)
     */
    public Audit(String entity, String actionType, Long user_id, String details) {
        this.entity = entity;
        this.actionType = actionType;
        this.user_id = user_id;
        this.details = details;
        this.timestamp = LocalDateTime.now();  // Records the current date and time
    }
}