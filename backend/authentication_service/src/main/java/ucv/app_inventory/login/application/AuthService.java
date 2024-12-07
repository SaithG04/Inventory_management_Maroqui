package ucv.app_inventory.login.application;

import ucv.app_inventory.login.adapters.controller.dto.JwtResponse;

public interface AuthService {

    JwtResponse authenticateUser(String email, String clave);
    JwtResponse refreshAccessToken(String refreshToken);
    void logoutUser(String email);
}
