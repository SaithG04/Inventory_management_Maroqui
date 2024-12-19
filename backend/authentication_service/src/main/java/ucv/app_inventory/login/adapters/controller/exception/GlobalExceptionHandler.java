package ucv.app_inventory.login.adapters.controller.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import ucv.app_inventory.login.domain.exception.EmailAlreadyExistsException;
import ucv.app_inventory.login.domain.exception.InvalidCredentials;
import ucv.app_inventory.login.domain.exception.RoleNotFoundException;
import ucv.app_inventory.login.domain.exception.UserNotFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<DetailException> handleUserNotFoundException(UserNotFoundException e) {
        logger.error("Usuario no encontrado: {}", e.getMessage());
        DetailException detalle = new DetailException("Usuario no encontrado", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detalle);
    }

    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<DetailException> handleInvalidCredentialsException(InvalidCredentials e) {
        logger.warn("Credenciales inválidas: {}", e.getMessage());
        DetailException detalle = new DetailException("Credenciales inválidas", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(detalle);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<DetailException> handleEmailAlreadyExistsException(EmailAlreadyExistsException e) {
        logger.warn("Email ya existe: {}", e.getMessage());
        DetailException detalle = new DetailException("Email ya registrado", e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(detalle);
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<DetailException> handleRoleNotFoundException(RoleNotFoundException e) {
        logger.error("Rol no encontrado: {}", e.getMessage());
        DetailException detalle = new DetailException("Rol no encontrado", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detalle);
    }

    // Manejo global para otras excepciones
    @ExceptionHandler(Exception.class)
    public ResponseEntity<DetailException> handleGlobalException(Exception e) {
        logger.error("Error inesperado: {}", e.getMessage(), e);
        DetailException detalle = new DetailException("Error inesperado", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(detalle);
    }
}
