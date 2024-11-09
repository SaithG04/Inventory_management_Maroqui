package ucv.app_inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {
        "ucv.app_inventory.Supplier.domain"})
public class AppInventoryApplication {

    public static void main(String[] args) {
          SpringApplication.run(AppInventoryApplication.class, args);
    }
}
