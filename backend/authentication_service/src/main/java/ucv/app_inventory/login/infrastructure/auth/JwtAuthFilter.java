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

/**
 * JwtAuthFilter es un filtro que intercepta cada solicitud HTTP para verificar
 * la autenticidad del token JWT y configurar la autenticación en el contexto de seguridad.
 */

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final TokenManagementService tokenManagementService;
    private final TokenRevocationService tokenRevocationService;
    private final CustomUserDetailsService customUserDetailsService;

    /**
     * Constructor para inicializar los servicios necesarios.
     *
     * @param tokenManagementService Servicio para gestionar tokens JWT
     * @param tokenRevocationService Servicio para verificar revocación de tokens
     * @param customUserDetailsService Servicio para cargar detalles de usuario
     */

    @Autowired
    public JwtAuthFilter(TokenManagementService tokenManagementService,
                         TokenRevocationService tokenRevocationService,
                         CustomUserDetailsService customUserDetailsService) {
        this.tokenManagementService = tokenManagementService;
        this.tokenRevocationService = tokenRevocationService;
        this.customUserDetailsService = customUserDetailsService;
    }

    /**
     * Método que filtra y autentica solicitudes HTTP mediante tokens JWT.
     *
     * @param request Solicitud HTTP
     * @param response Respuesta HTTP
     * @param filterChain Cadena de filtros
     * @throws ServletException en caso de error en el procesamiento
     * @throws IOException en caso de error de entrada/salida
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        if (path.startsWith("/swagger-ui") ||
                path.equals("/swagger-ui.html") ||
                path.startsWith("/v3/api-docs")) {
            filterChain.doFilter(request, response);
            return;
        }

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
            } catch (JwtException | UsernameNotFoundException e) {
                logger.error("Error en la autenticación con el token: {}");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido o expirado");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}