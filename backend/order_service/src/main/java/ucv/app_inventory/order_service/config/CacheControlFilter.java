package ucv.app_inventory.order_service.config;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")
public class CacheControlFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Verificar el encabezado Cache-Control
        String cacheControl = httpRequest.getHeader("Cache-Control");

        if ("no-store".equalsIgnoreCase(cacheControl)) {
            // Invalida el caché de la respuesta
            httpResponse.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        } else if ("no-cache".equalsIgnoreCase(cacheControl)) {
            // Instruye al navegador a verificar si la respuesta está modificada
            httpResponse.setHeader("Cache-Control", "no-cache, must-revalidate");
        } else {
            // Si no se indica, puedes dejar que la API gestione el caché normalmente
            httpResponse.setHeader("Cache-Control", "public, max-age=3600");
        }

        chain.doFilter(request, response);
    }

}
