package ucv.app_inventory.application.DTO;

import lombok.Data;

@Data
public class SupplierDTO {
    private Long id;
    private String name;
    private String contact;
    private String phone;
    private String email;
    private String address;
}