package ucv.app_inventory.login.auth;

import ucv.app_inventory.login.application.AuthUser;
import ucv.app_inventory.login.domain.auth.TokenManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import ucv.app_inventory.login.domain.exceptions.CredencialesInvalidas;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.springframework.security.authentication.BadCredentialsException;

public class AutenticacionUsuarioTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenManagementService jwtTokenUsuario;

    @InjectMocks
    private AuthUser autenticacionUsuario;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void autenticarUsuario_DeberiaRetornarTokenJWT_CuandoCredencialesSonCorrectas() {
        String email = "usuario@correo.com";
        String clave = "clave123";
        String tokenGenerado = "tokenJWTValido";

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(jwtTokenUsuario.generarToken(email)).thenReturn(tokenGenerado);

        String token = autenticacionUsuario.autenticarUsuario(email, clave);

        assertEquals(tokenGenerado, token);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenUsuario).generarToken(email);
    }

    @Test
void autenticarUsuario_DeberiaLanzarCredencialesInvalidasException_CuandoCredencialesSonIncorrectas() {
    String email = "usuarioIncorrecto";
    String clave = "claveIncorrecta";

    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
        .thenThrow(new BadCredentialsException("Usuario o contraseña incorrectos"));

    assertThrows(CredencialesInvalidas.class, () -> {
        autenticacionUsuario.autenticarUsuario(email, clave);
    });

    verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
}
}
