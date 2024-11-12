package ucv.app_inventory.order_service.exception;

public class TotalCannotBeNullException extends RuntimeException {

    public TotalCannotBeNullException(String message) {
        super(message);
    }

    public TotalCannotBeNullException(String message, Throwable cause) {
        super(message, cause);
    }
}
