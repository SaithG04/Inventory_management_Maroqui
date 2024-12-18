package ucv.app_inventory.login.domain.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.adapters.persistence.TokenRevocationRepository;
import ucv.app_inventory.login.domain.model.RevokedToken;


@Service
public class TokenRevocationService {

    private static final Logger logger = LoggerFactory.getLogger(TokenRevocationService.class);

    private final TokenRevocationRepository tokenRevocationRepository;

    @Autowired
    public TokenRevocationService(TokenRevocationRepository tokenRevocationRepository) {
        this.tokenRevocationRepository = tokenRevocationRepository;
    }
    /**
     * Verifica si un token ha sido revocado.
     * @param token Token a verificar.
     * @return true si el token está revocado, false en caso contrario.
     */
    public boolean isTokenRevoked(String token) {
        if (token == null || token.isEmpty()) {
            logger.error("Intento de verificar revocación de un token nulo o vacío.");
            throw new IllegalArgumentException("Token no válido.");
        }
        return tokenRevocationRepository.existsByToken(token);
    }
    /**
     * Revoca un token específico.
     * @param token Token a revocar.
     */
    public void revokeToken(String token) {
        if (token == null || token.isEmpty()) {
            logger.error("Intento de revocar un token nulo o vacío.");
            throw new IllegalArgumentException("Token no válido para revocar.");
        }

        logger.info("Revocando el token: {}", token);

        RevokedToken revokedToken = new RevokedToken();
        revokedToken.setToken(token);
        revokedToken.setRevokedAt(System.currentTimeMillis());
        tokenRevocationRepository.save(revokedToken);
    }
    /**
     * Extrae el token del encabezado de una solicitud HTTP.
     * @param request Objeto HttpServletRequest.
     * @return Token extraído o null si no está presente.
     */
    public String extractTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}


