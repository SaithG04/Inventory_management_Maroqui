package ucv.app_inventory.login.domain.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ucv.app_inventory.login.adapters.persistance.TokenRevocationRepository;
import ucv.app_inventory.login.domain.model.RevokedToken;


@Service
public class TokenRevocationService {

    private final TokenRevocationRepository tokenRevocationRepository;

    @Autowired
    public TokenRevocationService(TokenRevocationRepository tokenRevocationRepository) {
        this.tokenRevocationRepository = tokenRevocationRepository;
    }

    public boolean isTokenRevoked(String token) {
        return tokenRevocationRepository.existsByToken(token);
    }

    public void revokeToken(String token) {
        RevokedToken revokedToken = new RevokedToken();
        revokedToken.setToken(token);
        revokedToken.setRevokedAt(System.currentTimeMillis());
        tokenRevocationRepository.save(revokedToken);
    }

    public String extractTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}

