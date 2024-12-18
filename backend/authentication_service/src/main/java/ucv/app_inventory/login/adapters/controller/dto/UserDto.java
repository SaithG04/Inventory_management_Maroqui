package ucv.app_inventory.login.adapters.controller.dto;

import lombok.Data;
import java.util.Set;
import java.time.LocalDate;

@Data
public class UserDto {
    private Long idUser;
    private String email;
    private String firstName;
    private String lastName;
    private String dni;
    private Integer age;
    private LocalDate birthDate;
    private String address;
    private String phone;
    private String sex;
    private String maritalStatus;
    private Set<String> roles;
    private String status;
}