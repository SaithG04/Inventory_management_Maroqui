package ucv.app_inventory.adapters.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public FeignInterceptor feignInterceptor(HttpServletRequest request) {
        return new FeignInterceptor(request);
    }
}
