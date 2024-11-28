package ucv.app_inventory.login.domain.exception;

public class CredencialesInvalidas extends RuntimeException {

    public CredencialesInvalidas(String mensaje) {
        super(mensaje);
    }
}
