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
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Invalid argument: " + ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(OrderNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponse<Void>> handleOrderNotFoundException(OrderNotFoundException ex) {
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "Order not found: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(TotalCannotBeNullException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<Void>> handleTotalCannotBeNullException(TotalCannotBeNullException ex) {
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Data integrity violation: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception e) {
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal server error: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
