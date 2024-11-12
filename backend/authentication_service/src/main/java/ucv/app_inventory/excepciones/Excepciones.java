package ucv.app_inventory.excepciones;

import ucv.app_inventory.login.adapters.controller.exception.DetalleExcepcion;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

/**
 * Clase global para manejar excepciones en la aplicación.
 */
@ControllerAdvice
public class Excepciones {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> manejarExcepcionGeneral(Exception ex, WebRequest request) {
        return new ResponseEntity<>(new DetalleExcepcion(ex.getMessage(), request.getDescription(false)), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<?> manejarJwtExpiradoException(ExpiredJwtException ex, WebRequest request) {
        return new ResponseEntity<>(new DetalleExcepcion("Token JWT expirado", request.getDescription(false)), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<?> manejarJwtException(JwtException ex, WebRequest request) {
        return new ResponseEntity<>(new DetalleExcepcion("Token JWT inválido", request.getDescription(false)), HttpStatus.UNAUTHORIZED);
    }
}
