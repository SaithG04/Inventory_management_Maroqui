package ucv.app_inventory.order_service.infrastructure.outbound.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ucv.app_inventory.order_service.application.dto.UserDTO;

/**
 * Feign client for interacting with the external User service.
 * Allows retrieving user information by user ID.
 */
@FeignClient(name = "user-service", url = "${user.service.url}")
public interface UserAPIClient {

    /**
     * Fetches user information by user email from the User service.
     *
     * @param email The email of the user to retrieve.
     * @return A UserDTO containing user details.
     */
    @GetMapping("/api/users/findByEmail")
    UserDTO getUserByEmail(@RequestParam String email);
}