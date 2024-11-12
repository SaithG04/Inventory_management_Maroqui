package ucv.app_inventory.order_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ucv.app_inventory.order_service.config.JwtConfig;

/**
 * Main application class for the Order Service application.
 * Configures Spring Boot with caching, Feign clients, and JPA repositories.
 */
@SpringBootApplication
@EnableFeignClients
@EnableCaching
@EnableJpaRepositories(basePackages = {
		"ucv.app_inventory.order_service.infrastructure.outbound.database",
		"ucv.app_inventory.order_service.audit"
})
@EnableConfigurationProperties(JwtConfig.class)
public class OrderServiceApplication {

	/**
	 * Main method to start the Spring Boot application.
	 *
	 * @param args Command-line arguments.
	 */
	public static void main(String[] args) {
		SpringApplication.run(OrderServiceApplication.class, args);
	}

}