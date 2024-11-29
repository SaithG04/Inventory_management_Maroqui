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
        return ResponseEntity.status(201).body(new ApiResponse<>("success", "Usuario registrado exitosamente", registeredUser));
    }

    // 2. Obtener todos los usuarios (requiere rol ADMIN)
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuarios obtenidos exitosamente", users));
    }

    // 3. Obtener la información del usuario autenticado
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto userDto = userService.getUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(new ApiResponse<>("success", "Información del usuario autenticado", userDto));
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

    // 12. Actualizar el perfil del usuario autenticado
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateUserProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserDto updatedProfile) {

        UserDto userDto = userService.updateUserProfile(userDetails.getUsername(), updatedProfile);
        return ResponseEntity.ok(new ApiResponse<>("success", "Perfil del usuario actualizado exitosamente", userDto));
    }

    // 13. Activar o desactivar un usuario
    @PutMapping("/activate/{id}")
    public ResponseEntity<ApiResponse<String>> activateUser(@PathVariable Long id, @RequestParam boolean isActive) {
        userService.setActiveStatus(id, isActive);
        String status = isActive ? "activado" : "desactivado";
        return ResponseEntity.ok(new ApiResponse<>("success", "Usuario " + status + " exitosamente", null));
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<String>> refreshToken(@RequestParam String refreshToken) {
        // Verificar el refresh token
        try {
            String email = tokenManagementService.getUsuarioToken(refreshToken);
            Optional<User> user = userService.findByEmail(email);
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>("error", "Usuario no encontrado", null));
            }

            // Verificar si el refresh token coincide con el guardado en la base de datos
            String storedRefreshToken = user.get().getRefreshToken();
            if (!storedRefreshToken.equals(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>("error", "Refresh token no válido", null));
            }

            // Generar un nuevo access token
            String newAccessToken = tokenManagementService.generateToken(user.get());

            return ResponseEntity.ok(new ApiResponse<>("success", "Nuevo token generado", newAccessToken));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("error", "Refresh token no válido o expirado", null));
        }
    }
    @PutMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal UserDetails userDetails) {
        userService.invalidateRefreshTokenByEmail(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}