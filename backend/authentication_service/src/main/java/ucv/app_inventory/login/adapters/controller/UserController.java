package ucv.app_inventory.login.adapters.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.login.adapters.controller.dto.ApiResponse;
import ucv.app_inventory.login.adapters.controller.dto.UserDto;
import ucv.app_inventory.login.adapters.controller.dto.UserRegistration;
import ucv.app_inventory.login.application.UserMapper;
import ucv.app_inventory.login.application.UserService;
import jakarta.validation.Valid;
import ucv.app_inventory.login.domain.model.User;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Usuarios", description = "Operaciones relacionadas con los usuarios")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    /**
     * Registra un nuevo usuario en el sistema.
     * @param userRegistration Datos de registro del usuario.
     * @return Usuario registrado con sus detalles.
     */
    @PostMapping("/register")
    @Operation(summary = "Registrar un nuevo usuario", description = "Permite registrar un nuevo usuario en el sistema")
    public ResponseEntity<ApiResponse<UserDto>> registerUser(
            @Parameter(description = "Datos de registro del usuario", required = true)
            @Valid @RequestBody UserRegistration userRegistration) {
        UserDto registeredUser = userService.registerUser(userRegistration);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("success", "Usuario registrado exitosamente", registeredUser));
    }
    /**
     * Obtiene todos los usuarios registrados.
     * @return Lista de usuarios.
     */
    @GetMapping
    @Operation(summary = "Obtener todos los usuarios", description = "Requiere rol ADMIN para acceder a esta operación")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuarios obtenidos exitosamente", users));
    }

    /**
     * Actualiza los detalles de un usuario específico.
     * @param id ID del usuario.
     * @param updatedUser Detalles actualizados del usuario.
     * @return Usuario actualizado.
     */
    @PutMapping("/update/{id}")
    @Operation(summary = "Actualizar un usuario", description = "Actualiza los detalles de un usuario específico")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @Parameter(description = "ID del usuario a actualizar", required = true)
            @PathVariable Long id,
            @Parameter(description = "Detalles actualizados del usuario", required = true)
            @Valid @RequestBody UserDto updatedUser) {
        UserDto user = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuario actualizado exitosamente", user));
    }
    /**
     * Elimina un usuario por su ID.
     * @param id ID del usuario.
     * @return Respuesta sin contenido.
     */
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Eliminar un usuario", description = "Elimina un usuario específico por su ID")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @Parameter(description = "ID del usuario a eliminar", required = true)
            @PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    /**
     * Asigna un rol a un usuario.
     * @param id ID del usuario.
     * @param roleName Nombre del rol a asignar.
     * @return Usuario con el rol asignado.
     */
    @PutMapping("/assign-role/{id}")
    @Operation(summary = "Asignar rol a un usuario", description = "Asigna un rol específico a un usuario por su ID")
    public ResponseEntity<ApiResponse<UserDto>> assignRoleToUser(
            @Parameter(description = "ID del usuario", required = true)
            @PathVariable Long id,
            @Parameter(description = "Nombre del rol a asignar", required = true)
            @RequestParam String roleName) {
        UserDto updatedUser = userService.assignRoleToUser(id, roleName);
        return ResponseEntity.ok(new ApiResponse<>("success", "Rol asignado exitosamente al usuario", updatedUser));
    }
    /**
     * Obtiene todos los roles disponibles en el sistema.
     * @return Lista de roles.
     */
    @GetMapping("/roles")
    @Operation(summary = "Obtener todos los roles", description = "Obtiene una lista de todos los roles disponibles en el sistema")
    public ResponseEntity<ApiResponse<List<String>>> getAllRoles() {
        List<String> roles = userService.getAllRoles();
        return ResponseEntity.ok(new ApiResponse<>("success", "Roles obtenidos exitosamente", roles));
    }
    /**
     * Obtiene el perfil del usuario autenticado.
     * @param userDetails Detalles del usuario autenticado.
     * @return Perfil del usuario.
     */
    @GetMapping("/profile")
    @Operation(summary = "Obtener perfil del usuario", description = "Obtiene el perfil del usuario actualmente autenticado")
    public ResponseEntity<ApiResponse<UserDto>> getUserProfile(
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserDetails userDetails) {
        UserDto userDto = userService.getUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(new ApiResponse<>("success", "Perfil del usuario obtenido exitosamente", userDto));
    }
    /**
     * Activa o desactiva un usuario.
     * @param id ID del usuario.
     * @param isActive Estado de activación.
     * @return Mensaje de confirmación.
     */
    @PutMapping("/activate/{id}")
    @Operation(summary = "Activar o desactivar un usuario", description = "Permite activar o desactivar un usuario específico por su ID")
    public ResponseEntity<ApiResponse<String>> activateUser(
            @Parameter(description = "ID del usuario", required = true)
            @PathVariable Long id,
            @Parameter(description = "Estado de activación", required = true)
            @RequestParam boolean isActive) {
        userService.setActiveStatus(id, isActive);
        String status = isActive ? "ACTIVE" : "INACTIVE";
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuario " + status + " exitosamente", null));
    }
    /**
     * Busca un usuario por su email.
     * @param email Email del usuario.
     * @return Detalles del usuario.
     */
    @GetMapping("/findByEmail")
    @Operation(summary = "Buscar usuario por email", description = "Obtiene un usuario basado en su dirección de email")
    public ResponseEntity<ApiResponse<UserDto>> getByEmail(
            @Parameter(description = "Email del usuario a buscar", required = true)
            @RequestParam String email) {
        Optional<User> user = userService.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("error", "Usuario no encontrado", null));
        }

        UserDto userDTO = UserMapper.toUserDto(user.get());
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuario obtenido exitosamente", userDTO));
    }
}