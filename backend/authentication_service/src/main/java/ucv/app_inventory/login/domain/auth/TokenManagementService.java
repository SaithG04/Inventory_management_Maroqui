package ucv.app_inventory.login.domain.auth;

import org.springframework.stereotype.Service;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import ucv.app_inventory.login.domain.model.Usuario;

/**
 * Clase utilitaria para manejar operaciones JWT como generación y validación de
 * tokens.
 */
@Service
public class TokenManagementService {

    private static final Logger logger = LoggerFactory.getLogger(TokenManagementService.class);

    private final SecretKey claveSecreta;
    private final long tiempoExp;
    private final JwtParser jwtParser;

    public TokenManagementService(
            @Value("${generartoken}") String claveSecreta,
            @Value("${jwt.expiration.time:3600}") long tiempoExp) {
        if (claveSecreta.length() >= 64) {
            this.claveSecreta = Keys.hmacShaKeyFor(claveSecreta.getBytes(StandardCharsets.UTF_8));
        } else {
            throw new IllegalArgumentException("La clave secreta debe tener al menos 64 caracteres para proporcionar seguridad adecuada.");
        }

        this.tiempoExp = tiempoExp * 1000;
        this.jwtParser = Jwts.parserBuilder()
                .setSigningKey(this.claveSecreta)
                .build();
    }

    public String generarToken(Usuario usuario) {
        String roles = usuario.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("name", usuario.getFullname())
                .claim("email", usuario.getEmail())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + tiempoExp))
                .signWith(claveSecreta, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Valida el token JWT proporcionado.
     *
     * @param token Token JWT a validar.
     * @return {@code true} si el token es válido, {@code false} en caso
     * contrario.
     */
    public boolean validarToken(String token) {
        try {
            jwtParser.parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Token JWT malformado: {}", e.getMessage());
            throw e;
        } catch (ExpiredJwtException e) {
            logger.error("Token JWT expirado: {}", e.getMessage());
            throw e;
        } catch (SignatureException e) {
            logger.error("Firma del Token JWT no válida: {}", e.getMessage());
            throw e;
        } catch (JwtException e) {
            logger.error("Token JWT inválido: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Extrae el nombre de usuario del token JWT proporcionado.
     *
     * @param token Token JWT del cual extraer el nombre de usuario.
     * @return Nombre de usuario (claim `sub`) contenido en el token.
     */
    public String getUsuarioToken(String token) {
        Claims claims = jwtParser.parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    /**
     * Obtiene el tiempo de expiración del token JWT en milisegundos.
     *
     * @param token Token JWT del cual extraer la fecha de expiración.
     * @return Tiempo en milisegundos hasta la fecha de expiración del token.
     */
    public long getExpirationMillis(String token) {
        Claims claims = jwtParser.parseClaimsJws(token).getBody();
        Date expiration = claims.getExpiration(); // Extrae el claim `exp`
        return expiration.getTime() - System.currentTimeMillis();
    }
}
