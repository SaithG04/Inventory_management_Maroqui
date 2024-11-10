package ucv.app_inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.Objects;

@SpringBootApplication
public class AppInventoryApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();  // Cargar variables de entorno desde el archivo .env

        System.setProperty("spring.datasource.url", "jdbc:mysql://" + dotenv.get("MYSQL_HOST") + ":" + dotenv.get("MYSQL_PORT") + "/" + dotenv.get("MYSQL_DATABASE"));
        System.setProperty("spring.datasource.username", Objects.requireNonNull(dotenv.get("MYSQL_USER")));
        System.setProperty("spring.datasource.password", Objects.requireNonNull(dotenv.get("MYSQL_PASSWORD")));
        System.setProperty("generartoken", Objects.requireNonNull(dotenv.get("GENERAR_TOKEN")));
        
        System.setProperty("cors.allowed.origins", dotenv.get("CORS_ALLOWED_ORIGINS"));
        System.setProperty("cors.allowed.methods", dotenv.get("CORS_ALLOWED_METHODS"));
        System.setProperty("cors.allowed.headers", dotenv.get("CORS_ALLOWED_HEADERS"));
        System.setProperty("cors.exposed.headers", dotenv.get("CORS_EXPOSED_HEADERS"));
        System.setProperty("cors.allow.credentials", dotenv.get("CORS_ALLOW_CREDENTIALS"));
        
        SpringApplication.run(AppInventoryApplication.class, args);
    }
}
