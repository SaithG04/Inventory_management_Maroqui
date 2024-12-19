package ucv.app_inventory.order_service.application;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ucv.app_inventory.order_service.application.dto.*;
import ucv.app_inventory.order_service.application.dto.mappers.OrderMapper;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.exception.InvalidStateTransitionException;
import ucv.app_inventory.order_service.exception.SupplierNotFoundException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.SupplierAPIClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderUpdateUseCaseTest {

    @Mock
    private OrderMySqlRepository orderMySqlRepository;

    @Mock
    private OrderDetailMySqlRepository orderDetailMySqlRepository;

    @Mock
    private OrderCreateUseCase orderCreateUseCase;

    @Mock
    private OrderFindUseCase orderFindUseCase;

    @Mock
    private SupplierAPIClient supplierAPIClient;

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderUpdateUseCase orderUpdateUseCase;

    @Test
    void shouldUpdateOrderSuccessfully() {
        // Given
        Long orderId = 1L;

        OrderDTO oldOrderDTO = new OrderDTO();
        oldOrderDTO.setId(orderId);
        oldOrderDTO.setStatus("PENDING");
        oldOrderDTO.setOrderDate("2024-01-01");

        Order oldOrder = new Order();
        oldOrder.setId(orderId);
        oldOrder.setStatus(OrderState.PENDING);
        oldOrder.setOrderDate(LocalDate.of(2024, 1, 1));
        oldOrder.setSupplierId(1L);

        OrderDTO newOrderDTO = new OrderDTO();
        newOrderDTO.setStatus("PROCESSED");
        newOrderDTO.setOrderDate("2024-12-31");

        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setId(1L);
        supplierDTO.setName("Supplier A");

        OrderRequestDTO orderRequestDTO = new OrderRequestDTO();
        orderRequestDTO.setOrder(newOrderDTO);
        orderRequestDTO.setOrderDetails(List.of());

        when(orderFindUseCase.findById(orderId)).thenReturn(oldOrderDTO);
        when(orderMapper.mapToOrder(oldOrderDTO)).thenReturn(oldOrder);
        when(supplierAPIClient.getSupplierById(1L)).thenReturn(Optional.of(supplierDTO));
        when(orderMySqlRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Order updatedOrder = orderUpdateUseCase.updateOrder(orderId, orderRequestDTO);

        // Then
        assertNotNull(updatedOrder);
        assertEquals(OrderState.PROCESSED, updatedOrder.getStatus());
        assertEquals(LocalDate.of(2024, 12, 31), updatedOrder.getOrderDate());
        verify(orderMySqlRepository, times(1)).save(any(Order.class));
    }

    /*@Test
    void shouldThrowExceptionWhenSupplierCannotChange() {
        // Given
        // Setup the old order with a valid supplierId
        Order oldOrder = new Order();
        oldOrder.setId(1L);
        oldOrder.setSupplierId(1L); // Valid supplierId
        oldOrder.setStatus(OrderState.PENDING);
        oldOrder.setOrderDate(LocalDate.of(2024, 1, 1));

        // Mock the SupplierDTO associated with the order
        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setId(1L);
        supplierDTO.setName("Supplier A");

        // Ensure supplierAPIClient returns the correct supplier
        doReturn(Optional.of(supplierDTO)).when(supplierAPIClient).getSupplierById(1L);

        // Mock the old order DTO
        OrderDTO oldOrderDTO = new OrderDTO();
        oldOrderDTO.setId(1L);
        oldOrderDTO.setSupplierName("Supplier A");
        oldOrderDTO.setStatus("PENDING");
        oldOrderDTO.setOrderDate("2024-01-01");

        // Ensure orderFindUseCase returns the old order DTO
        doReturn(oldOrderDTO).when(orderFindUseCase).findById(1L);

        // Create a new OrderDTO simulating an attempt to change the supplier
        OrderDTO newOrderDTO = new OrderDTO();
        newOrderDTO.setSupplierName("New Supplier"); // Attempt to change the supplier

        // Wrap the new order in an OrderRequestDTO
        OrderRequestDTO orderRequestDTO = new OrderRequestDTO();
        orderRequestDTO.setOrder(newOrderDTO);

        // When & Then
        InvalidArgumentException exception = assertThrows(
                InvalidArgumentException.class,
                () -> orderUpdateUseCase.updateOrder(1L, orderRequestDTO)
        );

        // Verify the expected error message
        assertEquals("Supplier cannot change, ignore this parameter.", exception.getMessage());
    }



    @Test
    void shouldThrowExceptionWhenInvalidStateTransition() {
        // Given
        Long orderId = 1L;

        OrderDTO oldOrderDTO = new OrderDTO();
        oldOrderDTO.setId(orderId);
        oldOrderDTO.setStatus("PROCESSED");

        Order oldOrder = new Order();
        oldOrder.setId(orderId);
        oldOrder.setStatus(OrderState.PROCESSED);

        OrderDTO newOrderDTO = new OrderDTO();
        newOrderDTO.setStatus("PENDING");

        OrderRequestDTO orderRequestDTO = new OrderRequestDTO();
        orderRequestDTO.setOrder(newOrderDTO);

        when(orderFindUseCase.findById(orderId)).thenReturn(oldOrderDTO);
        when(orderMapper.mapToOrder(oldOrderDTO)).thenReturn(oldOrder);

        // When & Then
        InvalidStateTransitionException exception = assertThrows(
                InvalidStateTransitionException.class,
                () -> orderUpdateUseCase.updateOrder(orderId, orderRequestDTO)
        );

        assertEquals("The state transition is not valid.", exception.getMessage());
        verify(orderMySqlRepository, never()).save(any(Order.class));
    }*/

    @Test
    void shouldUpdateOrderDetailsSuccessfully() {
        // Given
        Long orderId = 1L;

        OrderDTO oldOrderDTO = new OrderDTO();
        oldOrderDTO.setId(orderId);

        Order oldOrder = new Order();
        oldOrder.setId(orderId);
        oldOrder.setSupplierId(1L);

        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setId(1L);
        supplierDTO.setName("Supplier A");

        OrderDetailDTO detailDTO = new OrderDetailDTO();
        detailDTO.setProductName("Product A");
        detailDTO.setQuantity(5L);

        OrderRequestDTO orderRequestDTO = new OrderRequestDTO();
        orderRequestDTO.setOrder(oldOrderDTO);
        orderRequestDTO.setOrderDetails(List.of(detailDTO));

        when(orderFindUseCase.findById(orderId)).thenReturn(oldOrderDTO);
        when(orderMapper.mapToOrder(oldOrderDTO)).thenReturn(oldOrder);
        when(supplierAPIClient.getSupplierById(1L)).thenReturn(Optional.of(supplierDTO));
        when(orderCreateUseCase.processOrderDetails(anyList(), anyString(), any(Order.class)))
                .thenReturn(BigDecimal.valueOf(500));
        when(orderMySqlRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Order updatedOrder = orderUpdateUseCase.updateOrder(orderId, orderRequestDTO);

        // Then
        assertNotNull(updatedOrder);
        assertEquals(BigDecimal.valueOf(500), updatedOrder.getTotal());
        verify(orderDetailMySqlRepository, times(1)).deleteAll(anyList());
        verify(orderMySqlRepository, times(1)).save(any(Order.class));
    }
}
