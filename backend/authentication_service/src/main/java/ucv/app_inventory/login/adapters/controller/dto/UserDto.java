package ucv.app_inventory.login.adapters.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.Set;
import java.time.LocalDate;

@Data
@Schema(description = "Datos de información del usuario")
public class UserDto {

    @Schema(description = "Identificador único del usuario", example = "1", required = true)
    private Long idUser;

    @Schema(description = "Correo electrónico del usuario", example = "usuario@example.com", required = true)
    private String email;

    @Schema(description = "Nombre de pila del usuario", example = "Juan", required = true)
    private String firstName;

    @Schema(description = "Apellido del usuario", example = "Pérez", required = true)
    private String lastName;

    @Schema(description = "Documento Nacional de Identidad del usuario", example = "12345678", required = true)
    private String dni;

    @Schema(description = "Edad del usuario", example = "30", required = true)
    private Integer age;

    @Schema(description = "Fecha de nacimiento del usuario", example = "1993-04-15", required = true)
    private LocalDate birthDate;

    @Schema(description = "Dirección del usuario", example = "Calle Falsa 123, Ciudad, País", required = false)
    private String address;

    @Schema(description = "Número de teléfono del usuario", example = "987789879", required = false)
    private String phone;

    @Schema(description = "Sexo del usuario", example = "Masculino", required = false)
    private String sex;

    @Schema(description = "Estado civil del usuario", example = "Soltero", required = false)
    private String maritalStatus;

    @Schema(description = "Conjunto de roles asignados al usuario", example = "[\"ADMINISTRATOR\", \"WAREHOSE CLARK\", \"SELLER\"]", required = true)
    private Set<String> roles;

    @Schema(description = "Estado del usuario (activo/inactivo)", example = "Activo", required = true)
    private String status;
}