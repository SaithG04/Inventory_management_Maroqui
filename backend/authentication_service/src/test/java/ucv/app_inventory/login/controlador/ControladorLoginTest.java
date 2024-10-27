package ucv.app_inventory.login.controlador;

import ucv.app_inventory.login.adapters.controller.ControllerLogin;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import ucv.app_inventory.login.application.AuthUser;
import ucv.app_inventory.login.adapters.controller.dto.LoginRequest;
import ucv.app_inventory.login.adapters.controller.dto.JwtResponse;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.springframework.http.HttpStatus;
import ucv.app_inventory.login.domain.exceptions.CredencialesInvalidas;

public class ControladorLoginTest {

    @Mock
    private AuthUser autenticacionUsuario;

    @InjectMocks
    private ControllerLogin controladorLogin;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);  // Inicializar los mocks
    }

    @Test
    void login_DeberiaRetornarTokenJWT_CuandoCredencialesSonCorrectas() {
        // Datos de prueba
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("usuario@correo.com");
        loginRequest.setClave("clave123");

        String tokenGenerado = "tokenJWTValido";

        // Simular autenticación exitosa y generación del token
        when(autenticacionUsuario.autenticarUsuario(loginRequest.getEmail(), loginRequest.getClave()))
                .thenReturn(tokenGenerado);

        // Ejecutar el método que estamos probando
        ResponseEntity<?> response = controladorLogin.login(loginRequest);

        // Verificar que se haya generado y retornado el token correctamente
        assertEquals(200, response.getStatusCodeValue());
        JwtResponse jwtResponse = (JwtResponse) response.getBody();
        assertNotNull(jwtResponse);
        assertEquals(tokenGenerado, jwtResponse.getToken());

        // Verificar que el servicio de autenticación haya sido llamado correctamente
        verify(autenticacionUsuario).autenticarUsuario(loginRequest.getEmail(), loginRequest.getClave());
    }

    @Test
    void login_DeberiaRetornar401_CuandoCredencialesSonIncorrectas() {
        // Datos de prueba
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("usuarioIncorrecto");
        loginRequest.setClave("claveIncorrecta");

        // Simular fallo de autenticación lanzando la excepción personalizada
        when(autenticacionUsuario.autenticarUsuario(loginRequest.getEmail(), loginRequest.getClave()))
                .thenThrow(new CredencialesInvalidas("Usuario o contraseña incorrectos"));

        // Ejecutar el método que estamos probando
        ResponseEntity<?> response = controladorLogin.login(loginRequest);

        // Verificar que se retorne el error 401
        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatusCodeValue());

        // Verificar que el servicio de autenticación haya sido llamado correctamente
        verify(autenticacionUsuario).autenticarUsuario(loginRequest.getEmail(), loginRequest.getClave());
    }
}
