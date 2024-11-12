package ucv.app_inventory.order_service.domain.model;

/**
 * Enum representing the possible states of an order in the system.
 */
public enum OrderState {
    PENDING,     // The order is awaiting processing.
    PROCESSED,   // The order has been processed.
    CANCELED     // The order has been canceled.
}
