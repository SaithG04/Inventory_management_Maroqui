package ucv.app_inventory.login.adapters.controller.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import ucv.app_inventory.login.domain.model.MaritalStatus;
import ucv.app_inventory.login.domain.model.Sex;
import java.time.LocalDate;

@Data
public class UserRegistration {

    @NotBlank(message = "El nombre es obligatorio")
    private String firstName;

    @NotBlank(message = "El apellido es obligatorio")
    private String lastName;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe proporcionar un email válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    @NotBlank(message = "El DNI es obligatorio")
    private String dni;

    @NotNull(message = "La edad es obligatoria")
    @Min(value = 0, message = "La edad no puede ser negativa")
    private Integer age;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser una fecha pasada")
    private LocalDate birthDate;

    @NotBlank(message = "La dirección es obligatoria")
    private String address;

    @NotBlank(message = "El teléfono es obligatorio")
    private String phone;

    @NotNull(message = "El sexo es obligatorio")
    private Sex sex;

    @NotNull(message = "El estado civil es obligatorio")
    private MaritalStatus maritalStatus;
}
