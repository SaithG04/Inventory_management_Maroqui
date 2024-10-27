package ucv.app_inventory.order_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableFeignClients
@EnableCaching
@EnableJpaRepositories(basePackages = {
		"ucv.app_inventory.order_service.infrastructure.outbound.database",
		"ucv.app_inventory.order_service.audit"
})
public class OrderServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrderServiceApplication.class, args);
	}

}
