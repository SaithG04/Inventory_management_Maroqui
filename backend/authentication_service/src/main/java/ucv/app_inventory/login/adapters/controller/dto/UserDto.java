package ucv.app_inventory.login.adapters.controller.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
    private Long idUser;
    private String email;
    private String firstName;
    private String lastName;
    private Set<String> roles;
    private String status;
}
