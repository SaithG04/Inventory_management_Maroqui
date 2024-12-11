package ucv.app_inventory.order_service.exception;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private int statusCode;
    private String message;
    private T data;  // Can be used for any data if necessary, for now it's `Void`

    public ApiResponse(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}