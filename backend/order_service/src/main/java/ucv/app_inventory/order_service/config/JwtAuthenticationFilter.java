package ucv.app_inventory.order_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ucv.app_inventory.order_service.exception.ApiResponseJSON;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private final JwtConfig jwtConfig;

    public JwtAuthenticationFilter(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (path.startsWith("/api/swagger-ui") || path.startsWith("/api/v3/api-docs") || path.startsWith("/api/swagger-resources") || path.startsWith("/api/webjars")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");
        logger.debug("Authorization Header: {}", authorizationHeader);
        SecretKey jwtKey = Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8));

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            logger.debug("Extracted Token: {}", token);

            try {
                Claims claims = Jwts.parserBuilder().setSigningKey(jwtKey).build().parseClaimsJws(token).getBody();
                String username = claims.getSubject();
                logger.debug("Parsed Username from JWT: {}", username);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username, null, null);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }

            } catch (io.jsonwebtoken.security.SignatureException e) {
                logger.error("Invalid JWT signature: {}", e.getMessage());
                ApiResponseJSON<Object> responseBody = new ApiResponseJSON<>(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT signature");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write(new ObjectMapper().writeValueAsString(responseBody));
                return;
            } catch (Exception e) {
                logger.error("Invalid JWT token: {}", e.getMessage());
                ApiResponseJSON<Object> responseBody = new ApiResponseJSON<>(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write(new ObjectMapper().writeValueAsString(responseBody));
                return;
            }

        }

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            ApiResponseJSON<Object> responseBody = new ApiResponseJSON<>(HttpServletResponse.SC_FORBIDDEN, "No Authorization header or it does not start with Bearer");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write(new ObjectMapper().writeValueAsString(responseBody));
            return;
        }

        filterChain.doFilter(request, response);
    }

}