package ucv.app_inventory.login.infraestructure.auth;

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
    private final CustomUserDetailsService customUserDetailsService; // Añadir el servicio de UserDetails

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
                // Obtener el email del token
                String email = tokenManagementService.getUsuarioToken(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Cargar los detalles completos del usuario (UserDetails)
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                    // Crear el objeto de autenticación con los detalles completos del usuario
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    // Establecer detalles adicionales
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Establecer la autenticación en el contexto de seguridad
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
