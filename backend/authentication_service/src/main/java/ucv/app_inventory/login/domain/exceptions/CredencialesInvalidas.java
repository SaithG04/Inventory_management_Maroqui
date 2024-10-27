package ucv.app_inventory.login.domain.exceptions;

public class CredencialesInvalidas extends RuntimeException {

    public CredencialesInvalidas(String mensaje) {
        super(mensaje);
    }
}
