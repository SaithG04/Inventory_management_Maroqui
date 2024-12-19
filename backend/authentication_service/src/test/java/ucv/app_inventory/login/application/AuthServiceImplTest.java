/*package ucv.app_inventory.login.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import ucv.app_inventory.login.adapters.controller.dto.JwtResponse;
import ucv.app_inventory.login.adapters.persistence.JpaUserRepository;
import ucv.app_inventory.login.domain.auth.TokenManagementService;
import ucv.app_inventory.login.domain.exception.InvalidCredentials;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.domain.model.User;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenManagementService tokenManagementService;

    @Mock
    private UserService userService;

    @Mock
    private JpaUserRepository userRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void authenticateUser_ValidCredentials_ReturnsJwtResponse() {
        // Arrange
        String email = "test@example.com";
        String password = "pass";
        User mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setStatus(Status.ACTIVE);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mock(Authentication.class));

        when(userRepository.findByEmailAndStatus(email, Status.ACTIVE))
                .thenReturn(Optional.of(mockUser));

        when(tokenManagementService.generateToken(mockUser)).thenReturn("accessToken");
        when(tokenManagementService.generateRefreshToken(mockUser)).thenReturn("refreshToken");
        when(userRepository.save(mockUser)).thenReturn(mockUser);

        // Act
        JwtResponse response = authService.authenticateUser(email, password);

        // Assert
        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        verify(userRepository, times(1)).save(mockUser);
    }


    @Test
    void authenticateUser_InvalidCredentials() {
        String email = "test@example.com";
        String password = "wrongpassword";

        // Mocking authenticationManager.authenticate to throw exception
        doThrow(new AuthenticationException("Invalid credentials") {}).when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        // Ejecutar y verificar excepciones
        InvalidCredentials exception = assertThrows(InvalidCredentials.class, () -> {
            authService.authenticateUser(email, password);
        });

        assertEquals("Usuario o contraseña incorrectos", exception.getMessage());

        // Verificar las interacciones
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, never()).findByEmailAndStatus(anyString(), any());
        verify(tokenManagementService, never()).generateToken(any());
        verify(tokenManagementService, never()).generateRefreshToken(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void logoutUser_ValidEmail_RefreshTokenSetToNull() {
        String email = "user@example.com";
        User mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setStatus(Status.ACTIVE);
        mockUser.setRefreshToken("someToken");

        when(userRepository.findByEmailAndStatus(email, Status.ACTIVE)).thenReturn(Optional.of(mockUser));
        when(userRepository.save(mockUser)).thenReturn(mockUser);

        authService.logoutUser(email);

        verify(userRepository, times(1)).save(mockUser);
        assertNull(mockUser.getRefreshToken());
    }

    @Test
    void logoutUser_NullEmail_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class,
                () -> authService.logoutUser(null));
    }

    @Test
    void logoutUser_UserNotFound_ThrowsInvalidCredentials() {
        when(userRepository.findByEmailAndStatus("unknown@example.com", Status.ACTIVE))
                .thenReturn(Optional.empty());

        assertThrows(InvalidCredentials.class,
                () -> authService.logoutUser("unknown@example.com"));
    }
}*/
