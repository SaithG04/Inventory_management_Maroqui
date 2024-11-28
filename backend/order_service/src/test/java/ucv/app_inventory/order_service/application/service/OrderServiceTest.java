package ucv.app_inventory.order_service.application.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import ucv.app_inventory.order_service.application.OrderFindUseCase;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProviderAPIClient;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProductAPIClient;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the OrderFindUseCase service, covering methods to find orders by various criteria.
 * Uses Mockito to mock dependencies and Spring Data's Page for pagination.
 */
class OrderServiceTest {

    @Mock
    private OrderMySqlRepository orderMySqlRepository;

    @Mock
    private ProviderAPIClient providerAPIClient;

    @Mock
    private ProductAPIClient productAPIClient;

    @InjectMocks
    private OrderFindUseCase orderFindUseCase;

    @BeforeEach
    void setUp() {
        // Initialize mocks before each test
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findById_shouldReturnOrder() {
        // Test data
        Order order = new Order();
        order.setId(1L);

        // Mock behavior
        when(orderMySqlRepository.findById(1L)).thenReturn(Optional.of(order));

        // Invoke method under test
        Optional<Order> result = orderFindUseCase.findById(1L);

        // Verify results
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        verify(orderMySqlRepository, times(1)).findById(1L);
    }

    @Test
    void findOrdersBySupplierAndStatus_shouldReturnFilteredList() {
        // Test data
        Page<Order> orders = new PageImpl<>(Arrays.asList(new Order(), new Order()));
        when(orderMySqlRepository.findBySupplierIdAndStatus(any(Long.class), any(OrderState.class), any(PageRequest.class)))
                .thenReturn(orders);

        // Invoke method under test
        Page<Order> result = orderFindUseCase.findOrdersBySupplierAndStatus(1L, OrderState.PROCESSED, PageRequest.of(0, 10));

        // Verify results
        assertThat(result.getContent().size()).isEqualTo(2);
        verify(orderMySqlRepository, times(1)).findBySupplierIdAndStatus(1L, OrderState.PROCESSED, PageRequest.of(0, 10));
    }

    @Test
    void paginateOrders_shouldReturnPageOfOrders() {
        // Test data: create a list of orders and wrap in a Page object
        List<Order> orders = Arrays.asList(new Order(), new Order());
        Page<Order> pageOfOrders = new PageImpl<>(orders);

        // Mock repository behavior
        when(orderMySqlRepository.findByOrderDateBetween(any(LocalDate.class), any(LocalDate.class), any(PageRequest.class)))
                .thenReturn(pageOfOrders);

        // Use LocalDate for date handling
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        // Invoke method under test
        Page<Order> result = orderFindUseCase.findOrdersByDate(today, tomorrow, PageRequest.of(0, 10));

        // Verify that the result is not null and contains expected elements
        assertThat(result).isNotNull();
        assertThat(result.getContent().size()).isEqualTo(2);  // Contains 2 orders in the list

        // Verify the repository was called with correct arguments
        verify(orderMySqlRepository, times(1)).findByOrderDateBetween(today, tomorrow, PageRequest.of(0, 10));
    }

}
