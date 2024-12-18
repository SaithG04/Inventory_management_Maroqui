package ucv.app_inventory.login.infrastructure.auth;

import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
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
import ucv.app_inventory.login.adapters.auth.CustomUserDetailsService;
import ucv.app_inventory.login.domain.auth.TokenManagementService;
import ucv.app_inventory.login.domain.auth.TokenRevocationService;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final TokenManagementService tokenManagementService;
    private final TokenRevocationService tokenRevocationService;
    private final CustomUserDetailsService customUserDetailsService;

    @Autowired
    public JwtAuthFilter(TokenManagementService tokenManagementService,
                         TokenRevocationService tokenRevocationService,
                         CustomUserDetailsService customUserDetailsService) {
        this.tokenManagementService = tokenManagementService;
        this.tokenRevocationService = tokenRevocationService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = tokenRevocationService.extractTokenFromRequest(request);
        if (token != null && !tokenRevocationService.isTokenRevoked(token)) {
            try {
                String email = tokenManagementService.getUsuarioToken(token);
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    logger.info("Token autenticado para el usuario: {}");
                }
            } catch (Exception e) {
                logger.error("Error en la autenticación con el token: {}");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido o expirado");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
