package ucv.app_inventory.order_service.config;

import jakarta.servlet.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * This configuration class sets up security settings for the application.
 * It configures HTTP security, including endpoint authorization, JWT filter, and session management.
 *
 * The class ensures that:
 * 1. Swagger UI and API documentation endpoints are accessible without authentication.
 * 2. All other requests require authentication.
 * 3. CSRF protection is disabled (commonly done in stateless REST APIs).
 * 4. JWT-based stateless session management is used, without storing any session state on the server.
 */
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Configures security settings for HTTP requests.
     *
     * @param http the HttpSecurity object to configure security settings.
     * @return the configured SecurityFilterChain.
     * @throws Exception if any error occurs during security configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disables CSRF protection as the API is stateless and relies on JWT authentication.
                .csrf(AbstractHttpConfigurer::disable)

                // Configures authorization rules for HTTP requests.
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                // Allows access to Swagger UI and OpenAPI documentation endpoints without authentication.
                                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()

                                // Requires authentication for all other endpoints.
                                .anyRequest().authenticated()
                )

                // Adds the JWT authentication filter before the default UsernamePasswordAuthenticationFilter.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // Configures the security context to not require explicit saving of authentication context.
                .securityContext(securityContext -> securityContext.requireExplicitSave(false))

                // Configures session management as stateless, meaning no session information is stored on the server.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
