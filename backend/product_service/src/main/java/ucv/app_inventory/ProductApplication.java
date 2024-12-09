package ucv.app_inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import ucv.app_inventory.adapters.config.JwtConfig;

@SpringBootApplication(scanBasePackages = "ucv.app_inventory")
@EnableFeignClients
@EnableCaching
@EnableDiscoveryClient
@EnableConfigurationProperties(JwtConfig.class)
public class ProductApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductApplication.class, args);
    }
}
