package ucv.app_inventory.login.infraestructure.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed.origins}")
    private String[] allowedOrigins;

    @Value("${cors.allowed.methods}")
    private String[] allowedMethods;

    @Value("${cors.allowed.headers}")
    private String[] allowedHeaders;

    @Value("${cors.exposed.headers}")
    private String[] exposedHeaders;

    @Value("${cors.allow.credentials}")
    private boolean allowCredentials;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permitir orígenes específicos
        configuration.setAllowedOriginPatterns(Arrays.asList(allowedOrigins));
        // Permitir métodos específicos
        configuration.setAllowedMethods(Arrays.asList(allowedMethods));
        // Permitir headers específicos
        configuration.setAllowedHeaders(Arrays.asList(allowedHeaders));
        // Exponer headers específicos
        configuration.setExposedHeaders(Arrays.asList(exposedHeaders));
        // Permitir credenciales
        configuration.setAllowCredentials(allowCredentials);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
