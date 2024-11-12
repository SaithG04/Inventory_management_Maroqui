package ucv.app_inventory.order_service.application.dto;

import lombok.Data;

@Data
public class ProviderDTO {
    private Long id;
    private String name;
    private String contact;
    private String email;
    private String phone;
}
