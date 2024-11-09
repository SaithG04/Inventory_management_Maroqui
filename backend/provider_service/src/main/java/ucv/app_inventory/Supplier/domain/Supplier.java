package ucv.app_inventory.Supplier.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "supplier_id")
    private Long supplierId;
    @Column(name = "category_id")
    private Long categoryId;
    private String name;
    private String contact;
    private String phone;
    private String email;
    private String address;
    private String conditions;


}