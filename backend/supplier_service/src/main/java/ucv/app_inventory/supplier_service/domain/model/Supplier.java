package ucv.app_inventory.supplier_service.domain.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "suppliers")
@Data
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String contact;

    @Column(nullable = false)
    private String phone;

    private String email;

    @Column(nullable = false)
    private String address;

    private String conditions;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE'", nullable = false)
    private SupplierState state;

    @PrePersist
    protected void onCreate() {
        this.state = SupplierState.ACTIVE;
    }
}
