package ucv.app_inventory.login.infraestructure.auth;

import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import ucv.app_inventory.login.domain.auth.TokenManagementService;
import ucv.app_inventory.login.domain.auth.TokenRevocationService;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final TokenManagementService tokenManagementService;
    private final TokenRevocationService tokenRevocationService;

    @Autowired
    public JwtAuthFilter(TokenManagementService tokenManagementService,
                         TokenRevocationService tokenRevocationService) {
        this.tokenManagementService = tokenManagementService;
        this.tokenRevocationService = tokenRevocationService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = tokenRevocationService.extractTokenFromRequest(request);

        if (token != null && !tokenRevocationService.isTokenRevoked(token)) {
            try {
                // Aquí obtenemos el email (o el campo que quieras) directamente desde el token
                String email = tokenManagementService.getUsuarioToken(token); // Suponiendo que este método extrae el email desde el token

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Si no es necesario cargar UserDetails, solo autenticamos directamente con el email
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            email, null, null);  // Solo con el email y las authorities serían opcionales
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }

            } catch (JwtException | UsernameNotFoundException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
