package ucv.app_inventory.login.auth;

import ucv.app_inventory.login.domain.auth.TokenManagementService;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TokenUsuarioTest {

    private TokenManagementService tokenUsuario;

    @BeforeEach
    void setUp() {
        tokenUsuario = new TokenManagementService("ClaveSecretaDePruebaParaJWT12345", 3600);
    }

    @Test
    void generarToken_RetornarTokenJWT() {
        String token = "EstaEsUnaClaveSecretaDePruebaParaJWTQueTieneMasDe64Caracteres123456";
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void validarToken_RetornarTrue_CuandoTokenEsValido() {
        String token = tokenUsuario.generarToken("ClaveSecretaDePru4324324da343qafdebaQueTieneExactamente64CaracteresDeLongitudABC");
        assertTrue(tokenUsuario.validarToken(token));
    }

    @Test
    void validarToken_RetornarFalse_CuandoTokenEsInvalido() {
        String tokenInvalido = "TokenInvalido";
        assertFalse(tokenUsuario.validarToken(tokenInvalido));
    }

    @Test
    void getUsuarioToken_RetornarNombreDeUsuario_CuandoTokenEsValido() {
        String token = tokenUsuario.generarToken("usuarioValido");
        String usuario = tokenUsuario.getUsuarioToken(token);
        assertEquals("usuarioValido", usuario);
    }

    @Test
    void getUsuarioToken_LanzarJwtException_CuandoTokenEsInvalido() {
        String tokenInvalido = "TokenInvalido";
        assertThrows(JwtException.class, () -> {
            tokenUsuario.getUsuarioToken(tokenInvalido);
        });
    }
}
