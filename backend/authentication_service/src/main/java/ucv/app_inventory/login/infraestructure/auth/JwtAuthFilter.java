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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import ucv.app_inventory.login.adapters.auth.CustomUserDetails;
import ucv.app_inventory.login.adapters.auth.UsuarioDetailsService;
import ucv.app_inventory.login.application.PruebaAuthService;
import ucv.app_inventory.login.application.UserService;
import ucv.app_inventory.login.application.UserServiceImpl;
import ucv.app_inventory.login.domain.auth.TokenManagementService;
import ucv.app_inventory.login.domain.auth.TokenRevocationService;
import ucv.app_inventory.login.domain.model.Status;
import ucv.app_inventory.login.domain.model.User;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {


    //private UsuarioDetailsService userDetailsService;
    @Autowired
    private PruebaAuthService authService;
    private final TokenManagementService tokenManagementService;
    private final TokenRevocationService tokenRevocationService;

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
                String email = tokenManagementService.getUsuarioToken(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = authService.authenticateUser(email);

                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
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

