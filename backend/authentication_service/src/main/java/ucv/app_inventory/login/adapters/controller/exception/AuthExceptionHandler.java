package ucv.app_inventory.login.adapters.controller.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import ucv.app_inventory.login.domain.exception.CredencialesInvalidas;

@ControllerAdvice
public class AuthExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(AuthExceptionHandler.class);

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<DetalleExcepcion> handleUsernameNotFoundException(UsernameNotFoundException e) {
        logger.error("User no encontrado: {}", e.getMessage());
        var detalle = new DetalleExcepcion("User no encontrado", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detalle);
    }

    @ExceptionHandler(CredencialesInvalidas.class)
    public ResponseEntity<DetalleExcepcion> handleCredencialesInvalidasException(CredencialesInvalidas e) {
        logger.warn("Credenciales inválidas: {}", e.getMessage());
        var detalle = new DetalleExcepcion("Credenciales inválidas", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(detalle);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<DetalleExcepcion> handleGlobalException(Exception e) {
        logger.error("Error inesperado: {}", e.getMessage(), e);
        var detalle = new DetalleExcepcion("Error inesperado", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(detalle);
    }
}
