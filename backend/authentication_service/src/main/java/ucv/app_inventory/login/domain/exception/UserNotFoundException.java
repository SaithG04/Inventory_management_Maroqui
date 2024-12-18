package ucv.app_inventory.login.domain.exception;

/**
 * Excepción lanzada cuando no se encuentra un usuario con un ID o email específico.
 */
public class UserNotFoundException extends RuntimeException {

    /**
     * Constructor que recibe un mensaje personalizado.
     *
     * @param message Detalle del error.
     */
    public UserNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructor que recibe un mensaje personalizado y una causa.
     *
     * @param message Detalle del error.
     * @param cause   Causa original de la excepción.
     */
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
