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

    @Column
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String unitMeasurement;

    @Column
    private Integer stock;

    @Column
    private Long categoryId;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK') DEFAULT 'ACTIVE'")
    private Status status;

    public enum Status {
        ACTIVE,
        DISCONTINUED,
        OUT_OF_STOCK
    }
}
