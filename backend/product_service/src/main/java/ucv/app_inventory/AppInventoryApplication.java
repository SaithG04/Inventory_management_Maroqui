package ucv.app_inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.Objects;

@SpringBootApplication(scanBasePackages = "ucv.app_inventory")

public class AppInventoryApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();  // Cargar variables de entorno desde el archivo .env

        System.setProperty("spring.datasource.url", "jdbc:mysql://" + dotenv.get("MYSQL_HOST") + ":" + dotenv.get("MYSQL_PORT") + "/" + dotenv.get("MYSQL_DATABASE"));
        System.setProperty("spring.datasource.username", Objects.requireNonNull(dotenv.get("MYSQL_USER")));
        System.setProperty("spring.datasource.password", Objects.requireNonNull(dotenv.get("MYSQL_PASSWORD")));
        SpringApplication.run(AppInventoryApplication.class, args);        
    }
}
