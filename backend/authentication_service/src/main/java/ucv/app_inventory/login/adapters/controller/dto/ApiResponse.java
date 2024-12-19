/**
 * Representa una respuesta genérica para las APIs.
 * @param <T> el tipo de dato contenido en la respuesta.
 */
package ucv.app_inventory.login.adapters.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {

    private String status; // Estado de la respuesta (ejemplo: "SUCCESS", "ERROR").
    private String message; // Mensaje descriptivo de la respuesta.
    private T data; // Datos asociados a la respuesta.
}
