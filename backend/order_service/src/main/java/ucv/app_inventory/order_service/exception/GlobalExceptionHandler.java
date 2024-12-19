package ucv.app_inventory.order_service.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponseJSON<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        ApiResponseJSON<Void> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), "Invalid argument: " + ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(OrderNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponseJSON<Void>> handleOrderNotFoundException(OrderNotFoundException ex) {
        ApiResponseJSON<Void> response = new ApiResponseJSON<>(HttpStatus.NOT_FOUND.value(), "Order not found: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(TotalCannotBeNullException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponseJSON<Void>> handleTotalCannotBeNullException(TotalCannotBeNullException ex) {
        ApiResponseJSON<Void> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponseJSON<Void>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        ApiResponseJSON<Void> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), "Data integrity violation: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponseJSON<Void>> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        ApiResponseJSON<Void> response = new ApiResponseJSON<>(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseJSON<Void>> handleGenericException(Exception e) {
        ApiResponseJSON<Void> response = new ApiResponseJSON<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal server error: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
