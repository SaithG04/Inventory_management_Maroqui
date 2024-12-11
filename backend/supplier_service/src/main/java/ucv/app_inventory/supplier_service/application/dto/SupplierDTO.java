package ucv.app_inventory.supplier_service.application.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.hateoas.RepresentationModel;

@EqualsAndHashCode(callSuper = true)
@Data
public class SupplierDTO extends RepresentationModel<SupplierDTO> {
    private Long id;
    private String name;
    private String contact;
    private String email;
    private String phone;
    private String address;
    private String conditions;
    private String state;
}
