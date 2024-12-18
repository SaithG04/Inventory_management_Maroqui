package ucv.app_inventory.login.adapters.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.login.adapters.controller.dto.ApiResponse;
import ucv.app_inventory.login.adapters.controller.dto.UserDto;
import ucv.app_inventory.login.adapters.controller.dto.UserRegistration;
import ucv.app_inventory.login.application.UserService;
import ucv.app_inventory.login.domain.auth.TokenManagementService;
import ucv.app_inventory.login.domain.model.User;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final TokenManagementService tokenManagementService;

    public UserController(UserService userService, TokenManagementService tokenManagementService) {
        this.userService = userService;
        this.tokenManagementService = tokenManagementService;
    }

    // 1. Registro de un nuevo usuario
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> registerUser(@Valid @RequestBody UserRegistration userRegistration) {
        UserDto registeredUser = userService.registerUser(userRegistration);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("success", "Usuario registrado exitosamente", registeredUser));
    }

    // 2. Obtener todos los usuarios (requiere rol ADMIN)
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuarios obtenidos exitosamente", users));
    }

    // 4. Actualizar un usuario específico
    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable Long id, @Valid @RequestBody UserDto updatedUser) {
        UserDto user = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuario actualizado exitosamente", user));
    }

    // 5. Eliminar un usuario
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // 6. Asignar un rol a un usuario
    @PutMapping("/assign-role/{id}")
    public ResponseEntity<ApiResponse<UserDto>> assignRoleToUser(@PathVariable Long id, @RequestParam String roleName) {
        UserDto updatedUser = userService.assignRoleToUser(id, roleName);
        return ResponseEntity.ok(new ApiResponse<>("success", "Rol asignado exitosamente al usuario", updatedUser));
    }

    // 7. Obtener todos los roles disponibles
    @GetMapping("/roles")
    public ResponseEntity<ApiResponse<List<String>>> getAllRoles() {
        List<String> roles = userService.getAllRoles();
        return ResponseEntity.ok(new ApiResponse<>("success", "Roles obtenidos exitosamente", roles));
    }

    // 11. Obtener el perfil del usuario autenticado
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto userDto = userService.getUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(new ApiResponse<>("success", "Perfil del usuario obtenido exitosamente", userDto));
    }

    // 13. Activar o desactivar un usuario
    @PutMapping("/activate/{id}")
    public ResponseEntity<ApiResponse<String>> activateUser(@PathVariable Long id, @RequestParam boolean isActive) {
        userService.setActiveStatus(id, isActive);
        String status = isActive ? "activado" : "desactivado";
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuario " + status + " exitosamente", null));
    }
    @GetMapping("/findByEmail")
    public ResponseEntity<UserDto> getByEmail(@RequestParam String email) {
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