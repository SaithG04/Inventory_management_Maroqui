/*package ucv.app_inventory.login.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    void authenticateUser_Success() {
        String email = "test@example.com";
        String password = "password123";
        String accessToken = "access-token";
        String refreshToken = "refresh-token";

        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setStatus(Status.ACTIVE);

        // Mocking authenticationManager.authenticate
        doNothing().when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        // Mocking userRepository.findByEmailAndStatus
        when(userRepository.findByEmailAndStatus(email, Status.ACTIVE)).thenReturn(Optional.of(user));

        // Mocking tokenGeneration
        when(tokenManagementService.generateToken(user)).thenReturn(accessToken);
        when(tokenManagementService.generateRefreshToken(user)).thenReturn(refreshToken);

        // Mocking userRepository.save
        when(userRepository.save(user)).thenReturn(user);

        // Ejecutar el método a probar
        JwtResponse response = authService.authenticateUser(email, password);

        // Verificar los resultados
        assertNotNull(response);
        assertEquals(accessToken, response.getAccessToken());
        assertEquals(refreshToken, response.getRefreshToken());

        // Verificar las interacciones
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).findByEmailAndStatus(email, Status.ACTIVE);
        verify(tokenManagementService, times(1)).generateToken(user);
        verify(tokenManagementService, times(1)).generateRefreshToken(user);
        verify(userRepository, times(1)).save(user);
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
    void authenticateUser_UserNotFoundOrInactive() {
        String email = "test@example.com";
        String password = "password123";

        // Mocking authenticationManager.authenticate
        doNothing().when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        // Mocking userRepository.findByEmailAndStatus to return empty
        when(userRepository.findByEmailAndStatus(email, Status.ACTIVE)).thenReturn(Optional.empty());

        // Ejecutar y verificar excepciones
        InvalidCredentials exception = assertThrows(InvalidCredentials.class, () -> {
            authService.authenticateUser(email, password);
        });

        assertEquals("Usuario no encontrado o no activo", exception.getMessage());

        // Verificar las interacciones
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).findByEmailAndStatus(email, Status.ACTIVE);
        verify(tokenManagementService, never()).generateToken(any());
        verify(tokenManagementService, never()).generateRefreshToken(any());
        verify(userRepository, never()).save(any());
    }
}*/
