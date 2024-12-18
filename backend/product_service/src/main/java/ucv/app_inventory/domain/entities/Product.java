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

    @Column(nullable = false,  unique = true)
    private String code;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('UN', 'MT', 'CJ') DEFAULT 'UN'", nullable = true)
    private UnitMeasurement unitMeasurement;

    @Column(nullable = true)
    private Integer stock;

    @Column(nullable = true)
    private Double salePrice;

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
        if (salePrice == null) {
            salePrice = 0.0;
        }

        if (unitMeasurement == null) {
            unitMeasurement = UnitMeasurement.UN;
        }
        if (stock == null) {
            stock = 0;
        }
        if (stock == 0) {
            status = Status.OUT_OF_STOCK;

        } else if (status == null) {
            status = Status.ACTIVE;
        }
        if (code == null || code.isEmpty()) {
            code = generateNextCode();
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (stock == 0) {
            status = Status.OUT_OF_STOCK;
        } else {
            status = Status.ACTIVE;
        }
    }

    @Transient
    private String generateNextCode() {
        // Este método será implementado en la clase ProductServiceImpl
        return null;
    }


}
