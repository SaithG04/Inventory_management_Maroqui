package ucv.app_inventory.login.adapters.controller.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import java.util.Set;
import java.time.LocalDate;

@Data
@ApiModel(description = "Datos de información del usuario")
public class UserDto {

    @ApiModelProperty(value = "Identificador único del usuario", example = "1", required = true, position = 0)
    private Long idUser;

    @ApiModelProperty(value = "Correo electrónico del usuario", example = "usuario@example.com", required = true)
    private String email;

    @ApiModelProperty(value = "Nombre de pila del usuario", example = "Juan", required = true)
    private String firstName;

    @ApiModelProperty(value = "Apellido del usuario", example = "Pérez", required = true)
    private String lastName;

    @ApiModelProperty(value = "Documento Nacional de Identidad del usuario", example = "12345678", required = true)
    private String dni;

    @ApiModelProperty(value = "Edad del usuario", example = "30", required = true)
    private Integer age;

    @ApiModelProperty(value = "Fecha de nacimiento del usuario", example = "1993-04-15", required = true)
    private LocalDate birthDate;

    @ApiModelProperty(value = "Dirección del usuario", example = "Calle Falsa 123, Ciudad, País", required = false)
    private String address;

    @ApiModelProperty(value = "Número de teléfono del usuario", example = "987789879", required = false)
    private String phone;

    @ApiModelProperty(value = "Sexo del usuario", example = "Masculino", required = false)
    private String sex;

    @ApiModelProperty(value = "Estado civil del usuario", example = "Soltero", required = false)
    private String maritalStatus;

    @ApiModelProperty(value = "Conjunto de roles asignados al usuario", example = "[\"ADMINISTRATOR\", \"WAREHOSE CLARK\", \"SELLER\"]", required = true)
    private Set<String> roles;

    @ApiModelProperty(value = "Estado del usuario (activo/inactivo)", example = "Activo", required = true)
    private String status;
}