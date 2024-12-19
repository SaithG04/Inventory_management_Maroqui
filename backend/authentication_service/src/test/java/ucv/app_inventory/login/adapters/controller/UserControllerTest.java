/*package ucv.app_inventory.login.adapters.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ucv.app_inventory.login.adapters.controller.dto.*;
import ucv.app_inventory.login.application.UserService;
import ucv.app_inventory.login.domain.model.User;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerUser_ShouldReturnCreatedResponse() {
        // Arrange
        UserRegistration registration = new UserRegistration();
        registration.setEmail("newuser@example.com");
        registration.setPassword("password");

        UserDto mockUserDto = new UserDto();
        mockUserDto.setEmail("newuser@example.com");

        when(userService.registerUser(registration)).thenReturn(mockUserDto);

        // Act
        ResponseEntity<ApiResponse<UserDto>> response = userController.registerUser(registration);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals("Usuario registrado exitosamente", response.getBody().getMessage());
        assertEquals(mockUserDto, response.getBody().getData());
    }

    @Test
    void getAllUsers_ShouldReturnOkWithUserList() {
        // Arrange
        UserDto user1 = new UserDto();
        user1.setEmail("user1@example.com");
        UserDto user2 = new UserDto();
        user2.setEmail("user2@example.com");

        List<UserDto> userList = Arrays.asList(user1, user2);
        when(userService.getAllUsers()).thenReturn(userList);

        // Act
        ResponseEntity<ApiResponse<List<UserDto>>> response = userController.getAllUsers();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals("Usuarios obtenidos exitosamente", response.getBody().getMessage());
        assertEquals(userList, response.getBody().getData());
    }

    @Test
    void updateUser_ShouldReturnOkWithUpdatedUser() {
        // Arrange
        Long userId = 1L;
        UserDto updatedUser = new UserDto();
        updatedUser.setEmail("updated@example.com");

        when(userService.updateUser(userId, updatedUser)).thenReturn(updatedUser);

        // Act
        ResponseEntity<ApiResponse<UserDto>> response = userController.updateUser(userId, updatedUser);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals("Usuario actualizado exitosamente", response.getBody().getMessage());
        assertEquals(updatedUser, response.getBody().getData());
    }

    @Test
    void deleteUser_ShouldReturnNoContent() {
        // Arrange
        Long userId = 2L;
        doNothing().when(userService).deleteUser(userId);

        // Act
        ResponseEntity<ApiResponse<Void>> response = userController.deleteUser(userId);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        // Response body debería ser null en este caso ya que se usa noContent()
        assertEquals(null, response.getBody());
    }

    @Test
    void assignRoleToUser_ShouldReturnOkWithUpdatedUser() {
        // Arrange
        Long userId = 3L;
        String roleName = "ROLE_ADMIN";
        UserDto updatedUser = new UserDto();
        updatedUser.setEmail("roleuser@example.com");

        when(userService.assignRoleToUser(userId, roleName)).thenReturn(updatedUser);

        // Act
        ResponseEntity<ApiResponse<UserDto>> response = userController.assignRoleToUser(userId, roleName);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals("Rol asignado exitosamente al usuario", response.getBody().getMessage());
        assertEquals(updatedUser, response.getBody().getData());
    }

    @Test
    void getAllRoles_ShouldReturnOkWithRolesList() {
        // Arrange
        List<String> roles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");
        when(userService.getAllRoles()).thenReturn(roles);

        // Act
        ResponseEntity<ApiResponse<List<String>>> response = userController.getAllRoles();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals("Roles obtenidos exitosamente", response.getBody().getMessage());
        assertEquals(roles, response.getBody().getData());
    }

    @Test
    void getUserProfile_ShouldReturnOkWithUserProfile() {
        // Arrange
        String email = "profile@example.com";
        UserDto userDto = new UserDto();
        userDto.setEmail(email);

        when(userService.getUserProfile(email)).thenReturn(userDto);

        // Act
        // Simulamos un UserDetails simple, normalmente pasarías un mock o un objeto real
        UserDetailsStub userDetailsStub = new UserDetailsStub(email);
        ResponseEntity<ApiResponse<UserDto>> response = userController.getUserProfile(userDetailsStub);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals("Perfil del usuario obtenido exitosamente", response.getBody().getMessage());
        assertEquals(userDto, response.getBody().getData());
    }

    @Test
    void activateUser_ShouldReturnOk() {
        // Arrange
        Long userId = 4L;
        boolean isActive = true;
        doNothing().when(userService).setActiveStatus(userId, isActive);

        // Act
        ResponseEntity<ApiResponse<String>> response = userController.activateUser(userId, isActive);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals("Usuario ACTIVE exitosamente", response.getBody().getMessage());
        assertEquals(null, response.getBody().getData());
    }

    @Test
    void getByEmail_UserFound_ShouldReturnOk() {
        // Arrange
        String email = "found@example.com";
        User user = new User(); // Suponiendo que el mapper lo convertirá correctamente
        user.setEmail(email);

        when(userService.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        ResponseEntity<ApiResponse<UserDto>> response = userController.getByEmail(email);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals("Usuario obtenido exitosamente", response.getBody().getMessage());
        // No verificamos contenido exacto, ya que el mapper no está mockeado,
        // pero en una prueba real, podrías mockear UserMapper o probar el resultado final.
    }

    @Test
    void getByEmail_UserNotFound_ShouldReturnNotFound() {
        // Arrange
        String email = "notfound@example.com";
        when(userService.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<ApiResponse<UserDto>> response = userController.getByEmail(email);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
        assertEquals("Usuario no encontrado", response.getBody().getMessage());
        assertEquals(null, response.getBody().getData());
    }

    // Clase interna para simular un UserDetails (si necesitas usar @AuthenticationPrincipal)
    static class UserDetailsStub implements org.springframework.security.core.userdetails.UserDetails {
        private final String username;

        UserDetailsStub(String username) {
            this.username = username;
        }

        @Override
        public Collection<? extends org.springframework.security.core.GrantedAuthority> getAuthorities() {
            return Collections.emptyList();
        }

        @Override
        public String getPassword() { return "password"; }

        @Override
        public String getUsername() { return username; }

        @Override
        public boolean isAccountNonExpired() { return true; }

        @Override
        public boolean isAccountNonLocked() { return true; }

        @Override
        public boolean isCredentialsNonExpired() { return true; }

        @Override
        public boolean isEnabled() { return true; }
    }
}*/