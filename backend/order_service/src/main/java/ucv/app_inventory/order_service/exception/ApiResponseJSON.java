package ucv.app_inventory.order_service.exception;

import lombok.Data;

@Data
public class ApiResponseJSON<T> {
    private int statusCode;
    private String message;
    private T data;

    public ApiResponseJSON(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}