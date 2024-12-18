package ucv.app_inventory.login.domain.auth;

import io.jsonwebtoken.security.SignatureException;
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
import ucv.app_inventory.login.domain.model.Role;
import ucv.app_inventory.login.domain.model.User;
import ucv.app_inventory.login.domain.model.UserProfile;

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
            @Value("${jwt.key}") String claveSecreta,
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

    public String generateToken(User user) {
        if (user == null || user.getEmail() == null) {
            logger.error("No se puede generar un token para un usuario con datos incompletos.");
            throw new IllegalArgumentException("Usuario inválido para generación de token.");
        }

        UserProfile userProfile = user.getUserProfile();
        String fullname = userProfile.getFirstName() + " " + userProfile.getLastName();
        String roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));

        logger.info("Generando token para el usuario: {}", user.getEmail());

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("email", user.getEmail())
                .claim("roles", roles)
                .claim("fullname", fullname)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + tiempoExp))
                .signWith(claveSecreta, SignatureAlgorithm.HS512)
                .compact();
    }
    public String generateRefreshToken(User user) {
        if (user == null || user.getEmail() == null) {
            logger.error("No se puede generar un refresh token para un usuario con datos incompletos.");
            throw new IllegalArgumentException("Usuario inválido para generación de refresh token.");
        }

        logger.info("Generando refresh token para el usuario: {}", user.getEmail());

        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000))
                .signWith(claveSecreta, SignatureAlgorithm.HS512)
                .compact();
    }

    public void validarToken(String token) {
        try {
            Claims claims = jwtParser.parseClaimsJws(token).getBody();
            Date expiration = claims.getExpiration();
            if (expiration.before(new Date())) {
                throw new JwtException("El token ha expirado.");
            }
        } catch (MalformedJwtException e) {
            throw new JwtException("Token malformado.");
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token expirado.");
        } catch (SignatureException e) {
            throw new JwtException("Firma no válida.");
        } catch (UnsupportedJwtException e) {
            throw new JwtException("Token inválido.");
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
        Date expiration = claims.getExpiration();
        return expiration.getTime() - System.currentTimeMillis();
    }
}
