package ucv.app_inventory.adapters.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class FeignInterceptor implements RequestInterceptor {

    private final HttpServletRequest request;

    public FeignInterceptor(HttpServletRequest request) {
        this.request = request;
    }

    @Override
    public void apply(RequestTemplate template) {
        // Obtener el token JWT de la cabecera Authorization
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (token != null && token.startsWith("Bearer ")) {
            // Agregar el token JWT en la cabecera Authorization de la solicitud Feign
            template.header(HttpHeaders.AUTHORIZATION, token);
        }
    }
}
