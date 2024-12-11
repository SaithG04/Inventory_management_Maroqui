package ucv.app_inventory.login.domain.exception;

public class InvalidCredentials extends RuntimeException {

    public InvalidCredentials(String mensaje) {
        super(mensaje);
    }
}
