/*package ucv.app_inventory.login.infrastructure.auth;

import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import ucv.app_inventory.login.adapters.auth.CustomUserDetails;
import ucv.app_inventory.login.adapters.auth.CustomUserDetailsService;
import ucv.app_inventory.login.domain.auth.TokenManagementService;
import ucv.app_inventory.login.domain.auth.TokenRevocationService;
import ucv.app_inventory.login.domain.model.Role;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.domain.model.User;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Set;

import static org.mockito.Mockito.*;

class JwtAuthFilterTest {

    @Mock
    private TokenManagementService tokenManagementService;

    @Mock
    private TokenRevocationService tokenRevocationService;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private JwtAuthFilter jwtAuthFilter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void doFilterInternal_ValidToken() throws ServletException, IOException {
        String token = "valid-token";
        String email = "user@example.com";

        // Crear un rol simulado
        Role userRole = new Role();
        userRole.setName("USER");

        // Crear un usuario simulado con roles
        User mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setStatus(Status.ACTIVE);
        mockUser.setRoles(Set.of(userRole));

        // Crear UserDetails a partir del usuario simulado
        CustomUserDetails userDetails = new CustomUserDetails(mockUser);

        // Mocking: extractTokenFromRequest
        when(tokenRevocationService.extractTokenFromRequest(request)).thenReturn(token);

        // Mocking: isTokenRevoked
        when(tokenRevocationService.isTokenRevoked(token)).thenReturn(false);

        // Mocking: getUsuarioToken
        when(tokenManagementService.getUsuarioToken(token)).thenReturn(email);

        // Mocking: customUserDetailsService.loadUserByUsername
        when(customUserDetailsService.loadUserByUsername(email)).thenReturn(userDetails);

        // Ejecutar el método a probar
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Verificar que la autenticación se establece en el contexto
        ArgumentCaptor<UsernamePasswordAuthenticationToken> authenticationTokenCaptor =
                ArgumentCaptor.forClass(UsernamePasswordAuthenticationToken.class);
        verify(securityContext, times(1)).setAuthentication(authenticationTokenCaptor.capture());

        UsernamePasswordAuthenticationToken authenticationToken = authenticationTokenCaptor.getValue();
        Assertions.assertNotNull(authenticationToken);
        Assertions.assertEquals(userDetails, authenticationToken.getPrincipal());
        Assertions.assertEquals(userDetails.getAuthorities(), authenticationToken.getAuthorities());

        // Verificar que el filtro continúa la cadena
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void doFilterInternal_InvalidToken() throws ServletException, IOException {
        String token = "invalid-token";

        // Mocking: extractTokenFromRequest
        when(tokenRevocationService.extractTokenFromRequest(request)).thenReturn(token);

        // Mocking: isTokenRevoked
        when(tokenRevocationService.isTokenRevoked(token)).thenReturn(false);

        // Mocking: getUsuarioToken lanza JwtException
        when(tokenManagementService.getUsuarioToken(token)).thenThrow(new JwtException("Token inválido"));

        // Ejecutar el método a probar
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Verificar que la autenticación no se establece
        verify(securityContext, never()).setAuthentication(any());

        // Verificar que el filtro no continúa la cadena
        verify(filterChain, never()).doFilter(request, response);

        // Verificar que se envía un error 401
        verify(response, times(1)).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
    }

    @Test
    void doFilterInternal_RevokedToken() throws ServletException, IOException {
        String token = "revoked-token";

        // Mocking: extractTokenFromRequest
        when(tokenRevocationService.extractTokenFromRequest(request)).thenReturn(token);

        // Mocking: isTokenRevoked
        when(tokenRevocationService.isTokenRevoked(token)).thenReturn(true);

        // Ejecutar el método a probar
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Verificar que la autenticación no se establece
        verify(securityContext, never()).setAuthentication(any());

        // Verificar que el filtro continúa la cadena sin autenticación
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void doFilterInternal_NoToken() throws ServletException, IOException {
        // Mocking: extractTokenFromRequest devuelve null
        when(tokenRevocationService.extractTokenFromRequest(request)).thenReturn(null);

        // Ejecutar el método a probar
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Verificar que la autenticación no se establece
        verify(securityContext, never()).setAuthentication(any());

        // Verificar que el filtro continúa la cadena
        verify(filterChain, times(1)).doFilter(request, response);
    }
}*/
