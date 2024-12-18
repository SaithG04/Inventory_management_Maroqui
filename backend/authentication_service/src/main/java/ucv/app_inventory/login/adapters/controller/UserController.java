package ucv.app_inventory.login.adapters.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.login.adapters.controller.dto.ApiResponse;
import ucv.app_inventory.login.adapters.controller.dto.UserDto;
import ucv.app_inventory.login.adapters.controller.dto.UserRegistration;
import ucv.app_inventory.login.application.UserService;
import jakarta.validation.Valid;
import ucv.app_inventory.login.domain.model.User;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Api(tags = "Usuarios", description = "Operaciones relacionadas con los usuarios")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 1. Registro de un nuevo usuario
    @PostMapping("/register")
    @ApiOperation(value = "Registrar un nuevo usuario", notes = "Permite registrar un nuevo usuario en el sistema")
    public ResponseEntity<ApiResponse<UserDto>> registerUser(
            @ApiParam(value = "Datos de registro del usuario", required = true)
            @Valid @RequestBody UserRegistration userRegistration) {
        UserDto registeredUser = userService.registerUser(userRegistration);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("success", "Usuario registrado exitosamente", registeredUser));
    }

    // 2. Obtener todos los usuarios
    @GetMapping
    @ApiOperation(value = "Obtener todos los usuarios", notes = "Requiere rol ADMIN para acceder a esta operación")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuarios obtenidos exitosamente", users));
    }

    // 4. Actualizar un usuario específico
    @PutMapping("/update/{id}")
    @ApiOperation(value = "Actualizar un usuario", notes = "Actualiza los detalles de un usuario específico")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @ApiParam(value = "ID del usuario a actualizar", required = true)
            @PathVariable Long id,
            @ApiParam(value = "Detalles actualizados del usuario", required = true)
            @Valid @RequestBody UserDto updatedUser) {
        UserDto user = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuario actualizado exitosamente", user));
    }

    // 5. Eliminar un usuario
    @DeleteMapping("/delete/{id}")
    @ApiOperation(value = "Eliminar un usuario", notes = "Elimina un usuario específico por su ID")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @ApiParam(value = "ID del usuario a eliminar", required = true)
            @PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // 6. Asignar un rol a un usuario
    @PutMapping("/assign-role/{id}")
    @ApiOperation(value = "Asignar rol a un usuario", notes = "Asigna un rol específico a un usuario por su ID")
    public ResponseEntity<ApiResponse<UserDto>> assignRoleToUser(
            @ApiParam(value = "ID del usuario", required = true)
            @PathVariable Long id,
            @ApiParam(value = "Nombre del rol a asignar", required = true)
            @RequestParam String roleName) {
        UserDto updatedUser = userService.assignRoleToUser(id, roleName);
        return ResponseEntity.ok(new ApiResponse<>("success", "Rol asignado exitosamente al usuario", updatedUser));
    }

    // 7. Obtener todos los roles disponibles
    @GetMapping("/roles")
    @ApiOperation(value = "Obtener todos los roles", notes = "Obtiene una lista de todos los roles disponibles en el sistema")
    public ResponseEntity<ApiResponse<List<String>>> getAllRoles() {
        List<String> roles = userService.getAllRoles();
        return ResponseEntity.ok(new ApiResponse<>("success", "Roles obtenidos exitosamente", roles));
    }

    // 11. Obtener el perfil del usuario autenticado
    @GetMapping("/profile")
    @ApiOperation(value = "Obtener perfil del usuario", notes = "Obtiene el perfil del usuario actualmente autenticado")
    public ResponseEntity<ApiResponse<UserDto>> getUserProfile(
            @ApiParam(hidden = true)
            @AuthenticationPrincipal UserDetails userDetails) {
        UserDto userDto = userService.getUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(new ApiResponse<>("success", "Perfil del usuario obtenido exitosamente", userDto));
    }

    // 13. Activar o desactivar un usuario
    @PutMapping("/activate/{id}")
    @ApiOperation(value = "Activar o desactivar un usuario", notes = "Permite activar o desactivar un usuario específico por su ID")
    public ResponseEntity<ApiResponse<String>> activateUser(
            @ApiParam(value = "ID del usuario", required = true)
            @PathVariable Long id,
            @ApiParam(value = "Estado de activación", required = true)
            @RequestParam boolean isActive) {
        userService.setActiveStatus(id, isActive);
        String status = isActive ? "activado" : "desactivado";
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuario " + status + " exitosamente", null));
    }

    // Obtener usuario por email
    @GetMapping("/findByEmail")
    @ApiOperation(value = "Buscar usuario por email", notes = "Obtiene un usuario basado en su dirección de email")
    public ResponseEntity<UserDto> getByEmail(
            @ApiParam(value = "Email del usuario a buscar", required = true)
            @RequestParam String email) {
        Optional<User> user = userService.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        UserDto userDTO = new UserDto();
        userDTO.setIdUser(user.get().getIdUser());
        userDTO.setEmail(user.get().getEmail());

        return ResponseEntity.ok(userDTO);
    }
}