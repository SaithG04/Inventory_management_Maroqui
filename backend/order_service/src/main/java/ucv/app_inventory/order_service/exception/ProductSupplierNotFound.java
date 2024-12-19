package ucv.app_inventory.order_service.exception;

public class ProductSupplierNotFound extends RuntimeException {
  public ProductSupplierNotFound(String message) {
    super(message);
  }
}
