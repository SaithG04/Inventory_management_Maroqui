package ucv.app_inventory.order_service.application;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import ucv.app_inventory.order_service.application.dto.OrderDTO;
import ucv.app_inventory.order_service.application.dto.mappers.OrderMapper;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.exception.OrderNotFoundException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.SupplierAPIClient;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderFindUseCaseTest {

    @Mock
    private OrderMySqlRepository orderMySqlRepository;

    @Mock
    private SupplierAPIClient supplierAPIClient;

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderFindUseCase orderFindUseCase;

    @Test
    void shouldFindOrderByIdSuccessfully() {
        // Given
        Order order = new Order();
        order.setId(1L);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);

        when(orderMySqlRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderMapper.mapToOrderDTO(order)).thenReturn(orderDTO);

        // When
        OrderDTO result = orderFindUseCase.findById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(orderMySqlRepository, times(1)).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenOrderNotFoundById() {
        // Given
        when(orderMySqlRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        OrderNotFoundException exception = assertThrows(
                OrderNotFoundException.class,
                () -> orderFindUseCase.findById(1L)
        );

        assertEquals("Order not found with ID: 1", exception.getMessage());
        verify(orderMySqlRepository, times(1)).findById(1L);
    }

    @Test
    void shouldListOrdersPaginatedSuccessfully() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Order order = new Order();
        Page<Order> orderPage = new PageImpl<>(List.of(order));

        OrderDTO orderDTO = new OrderDTO();

        when(orderMySqlRepository.findAll(pageable)).thenReturn(orderPage);
        when(orderMapper.mapToOrderDTO(order)).thenReturn(orderDTO);

        // When
        Page<OrderDTO> result = orderFindUseCase.listOrdersPaginated(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(orderMySqlRepository, times(1)).findAll(pageable);
    }

    @Test
    void shouldFindOrdersByDateSuccessfully() {
        // Given
        LocalDate startDate = LocalDate.of(2023, 1, 1);
        LocalDate endDate = LocalDate.of(2023, 12, 31);
        Pageable pageable = PageRequest.of(0, 10);

        Order order = new Order();
        Page<Order> orderPage = new PageImpl<>(List.of(order));

        OrderDTO orderDTO = new OrderDTO();

        when(orderMySqlRepository.findByOrderDateBetween(startDate, endDate, pageable)).thenReturn(orderPage);
        when(orderMapper.mapToOrderDTO(order)).thenReturn(orderDTO);

        // When
        Page<OrderDTO> result = orderFindUseCase.findOrdersByDate(startDate, endDate, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(orderMySqlRepository, times(1)).findByOrderDateBetween(startDate, endDate, pageable);
    }

    @Test
    void shouldThrowExceptionWhenStartDateAfterEndDate() {
        // Given
        LocalDate startDate = LocalDate.of(2023, 12, 31);
        LocalDate endDate = LocalDate.of(2023, 1, 1);
        Pageable pageable = PageRequest.of(0, 10);

        // When & Then
        InvalidArgumentException exception = assertThrows(
                InvalidArgumentException.class,
                () -> orderFindUseCase.findOrdersByDate(startDate, endDate, pageable)
        );

        assertEquals("The start date cannot be after the end date.", exception.getMessage());
        verify(orderMySqlRepository, never()).findByOrderDateBetween(any(), any(), any());
    }

    @Test
    void shouldFindOrdersByStatusSuccessfully() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Order order = new Order();
        order.setStatus(OrderState.PENDING);

        Page<Order> orderPage = new PageImpl<>(List.of(order));
        OrderDTO orderDTO = new OrderDTO();

        when(orderMySqlRepository.findByStatus(OrderState.PENDING, pageable)).thenReturn(orderPage);
        when(orderMapper.mapToOrderDTO(order)).thenReturn(orderDTO);

        // When
        Page<OrderDTO> result = orderFindUseCase.findOrdersByStatus("PENDING", pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(orderMySqlRepository, times(1)).findByStatus(OrderState.PENDING, pageable);
    }

    @Test
    void shouldThrowExceptionWhenInvalidStatusProvided() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When & Then
        InvalidArgumentException exception = assertThrows(
                InvalidArgumentException.class,
                () -> orderFindUseCase.findOrdersByStatus("INVALID_STATUS", pageable)
        );

        assertEquals("The status is not valid.", exception.getMessage());
        verify(orderMySqlRepository, never()).findByStatus(any(), any());
    }
}
