package ucv.app_inventory.login.adapters.controller;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringDocConfig {
    /**
     * Configura la información básica de la API para Swagger.
     * @return Objeto OpenAPI con detalles de la API.
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Inventario de Usuarios")
                        .version("1.0.0")
                        .description("Documentación de la API para la gestión de usuarios en el sistema de inventario"));
    }
}