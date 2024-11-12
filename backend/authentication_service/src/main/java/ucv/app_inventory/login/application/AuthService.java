package ucv.app_inventory.login.application;

public interface AuthService {

    String authenticateUser(String email, String clave);

    void logoutUser(String email);
}
