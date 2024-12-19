package ucv.app_inventory.order_service.application;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidStateException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderDeleteUseCaseTest {

    @Mock
    private OrderMySqlRepository orderMySqlRepository;

    @InjectMocks
    private OrderDeleteUseCase orderDeleteUseCase;

    @Test
    void shouldDeleteOrderSuccessfully() {
        // Given
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderState.PROCESSED);

        // No specific mock behavior needed for a successful deletion

        // When
        assertDoesNotThrow(() -> orderDeleteUseCase.deleteOrder(order));

        // Then
        verify(orderMySqlRepository, times(1)).deleteById(1L);
    }

    @Test
    void shouldThrowInvalidStateExceptionWhenOrderIsPending() {
        // Given
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderState.PENDING);

        // When & Then
        InvalidStateException exception = assertThrows(
                InvalidStateException.class,
                () -> orderDeleteUseCase.deleteOrder(order)
        );

        assertEquals("Cannot delete a pending order.", exception.getMessage());
        verify(orderMySqlRepository, never()).deleteById(anyLong());
    }

    @Test
    void shouldThrowRuntimeExceptionOnUnexpectedError() {
        // Given
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderState.PROCESSED);

        // Simulate an unexpected exception
        doThrow(new RuntimeException("Database error")).when(orderMySqlRepository).deleteById(1L);

        // When & Then
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> orderDeleteUseCase.deleteOrder(order)
        );

        assertTrue(exception.getMessage().contains("Failed to delete order with ID 1"));
        verify(orderMySqlRepository, times(1)).deleteById(1L);
    }
}
