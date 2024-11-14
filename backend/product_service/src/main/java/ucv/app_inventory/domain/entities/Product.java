package ucv.app_inventory.domain.entities;

import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product implements Serializable {

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('UN', 'MT', 'CJ') DEFAULT 'UN'", nullable = false)
    private UnitMeasurement unitMeasurement;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Long categoryId;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK') DEFAULT 'ACTIVE'", nullable = false)
    private Status status;

    public enum Status {
        ACTIVE,
        DISCONTINUED,
        OUT_OF_STOCK
    }

    public enum UnitMeasurement {
        UN,
        MT,
        CJ
    }

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = Status.ACTIVE;
        }
        if (unitMeasurement == null) {
            unitMeasurement = UnitMeasurement.UN;
        }
    }
}
