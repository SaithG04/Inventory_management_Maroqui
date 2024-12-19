/**
 * Representa una solicitud de registro de usuario.
 */
package ucv.app_inventory.login.adapters.controller.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import ucv.app_inventory.login.domain.model.MaritalStatus;
import ucv.app_inventory.login.domain.model.Sex;
import java.time.LocalDate;

@Data
public class UserRegistration {

    @NotBlank(message = "El nombre es obligatorio")
    private String firstName; // Nombre del usuario.

    @NotBlank(message = "El apellido es obligatorio")
    private String lastName; // Apellido del usuario.

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe proporcionar un email válido")
    private String email; // Email del usuario.

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password; // Contraseña del usuario.

    @NotBlank(message = "El DNI es obligatorio")
    private String dni; // Documento Nacional de Identidad del usuario.

    @NotNull(message = "La edad es obligatoria")
    @Min(value = 0, message = "La edad no puede ser negativa")
    private Integer age; // Edad del usuario.

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser una fecha pasada")
    private LocalDate birthDate; // Fecha de nacimiento del usuario.

    @NotBlank(message = "La dirección es obligatoria")
    private String address; // Dirección del usuario.

    @NotBlank(message = "El teléfono es obligatorio")
    private String phone; // Teléfono del usuario.

    @NotNull(message = "El sexo es obligatorio")
    private Sex sex; // Sexo del usuario.

    @NotNull(message = "El estado civil es obligatorio")
    private MaritalStatus maritalStatus; // Estado civil del usuario.

    @NotBlank(message = "El rol es obligatorio")
    @Pattern(regexp = "ADMINISTRATOR|WAREHOUSE CLARK|SELLER", message = "El rol debe ser ADMINISTRATOR, WAREHOUSE CLARK o SELLER")
    private String roleName; // Rol asignado al usuario.
}
