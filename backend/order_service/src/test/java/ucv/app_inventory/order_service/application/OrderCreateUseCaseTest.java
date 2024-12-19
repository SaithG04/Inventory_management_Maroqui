package ucv.app_inventory.order_service.application;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import ucv.app_inventory.order_service.application.dto.*;
import ucv.app_inventory.order_service.application.dto.mappers.OrderMapper;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.InvalidArgumentException;
import ucv.app_inventory.order_service.exception.SupplierNotFoundException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProductAPIClient;
import ucv.app_inventory.order_service.infrastructure.outbound.external.SupplierAPIClient;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class OrderCreateUseCaseTest {
    @Mock
    private OrderMySqlRepository orderMySqlRepository;

    @Mock
    private OrderDetailMySqlRepository orderDetailMySqlRepository;

    @Mock
    private SupplierAPIClient supplierAPIClient;

    @Mock
    private ProductAPIClient productAPIClient;

    @InjectMocks
    private OrderCreateUseCase orderCreateUseCase;

    private static final String VALID_SUPPLIER_NAME = "Supplier A";
    private static final String VALID_PRODUCT_NAME = "Product A";
    private static final String INVALID_PRODUCT_NAME = "Nonexistent Product";
    private static final String VALID_ORDER_DATE = "2024-12-20";

    @Test
    void shouldCreateOrderSuccessfully() {
        // Given
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setSupplierName(VALID_SUPPLIER_NAME);
        orderDTO.setOrderDate(VALID_ORDER_DATE);
        orderDTO.setStatus("PENDING");

        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setId(1L);
        supplierDTO.setName(VALID_SUPPLIER_NAME);

        OrderDetailDTO detailDTO = new OrderDetailDTO();
        detailDTO.setProductName(VALID_PRODUCT_NAME);
        detailDTO.setQuantity(10L);

        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(1L);
        productDTO.setName(VALID_PRODUCT_NAME);

        ProductSupplierDTO productSupplierDTO = new ProductSupplierDTO();
        productSupplierDTO.setId(1L);
        productSupplierDTO.setPrice(BigDecimal.valueOf(100));

        Order order = new Order();
        order.setId(1L);
        order.setSupplierId(supplierDTO.getId());

        // Mock behavior
        Page<SupplierDTO> supplierPage = new PageImpl<>(List.of(supplierDTO));

        when(supplierAPIClient.getSupplierByName(eq(VALID_SUPPLIER_NAME), any(Pageable.class)))
                .thenReturn(supplierPage);

        when(productAPIClient.getProductsByName(eq(VALID_PRODUCT_NAME), anyInt(), anyInt()))
                .thenReturn(Optional.of(List.of(productDTO)));

        when(productAPIClient.getRelationByProductIdAndSupplierId(eq(1L), eq(1L)))
                .thenReturn(Optional.of(productSupplierDTO));

        when(orderMySqlRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order savedOrder = invocation.getArgument(0);
            savedOrder.setId(1L);
            return savedOrder;
        });

        // When
        Order result = orderCreateUseCase.createOrder(orderDTO, List.of(detailDTO));

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(OrderState.PENDING, result.getStatus());
        assertEquals(1L, result.getSupplierId());

        // Capture the orders saved
        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
        verify(orderMySqlRepository, times(2)).save(orderCaptor.capture());
        List<Order> savedOrders = orderCaptor.getAllValues();

        // Validate final total
        assertEquals(0, savedOrders.get(1).getTotal().compareTo(BigDecimal.valueOf(1000))); // Final total

        // Verify the order details are saved
        verify(orderDetailMySqlRepository, times(1)).save(any(OrderDetail.class));
    }

    @Test
    void shouldThrowExceptionWhenSupplierNameIsEmpty() {
        // Given
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setSupplierName("");
        orderDTO.setOrderDate(VALID_ORDER_DATE);

        // When & Then
        InvalidArgumentException exception = assertThrows(
                InvalidArgumentException.class,
                () -> orderCreateUseCase.createOrder(orderDTO, List.of())
        );

        assertEquals("Supplier name cannot be empty.", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenProductDoesNotExist() {
        // Given
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setSupplierName(VALID_SUPPLIER_NAME);
        orderDTO.setOrderDate(VALID_ORDER_DATE);

        OrderDetailDTO detailDTO = new OrderDetailDTO();
        detailDTO.setProductName(INVALID_PRODUCT_NAME);

        // Mock behavior for supplier (valid supplier found)
        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setId(1L);
        supplierDTO.setName(VALID_SUPPLIER_NAME);
        Page<SupplierDTO> supplierPage = new PageImpl<>(List.of(supplierDTO));
        when(supplierAPIClient.getSupplierByName(eq(VALID_SUPPLIER_NAME), any(Pageable.class)))
                .thenReturn(supplierPage);

        // Mock behavior for product not found
        when(productAPIClient.getProductsByName(eq(INVALID_PRODUCT_NAME), anyInt(), anyInt()))
                .thenThrow(new InvalidArgumentException("No product found with name Nonexistent Product"));

        // When & Then
        InvalidArgumentException exception = assertThrows(
                InvalidArgumentException.class,
                () -> orderCreateUseCase.createOrder(orderDTO, List.of(detailDTO))
        );

        assertEquals("No product found with name Nonexistent Product", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenSupplierDoesNotExist() {
        // Given
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setSupplierName("Nonexistent Supplier");
        orderDTO.setOrderDate(VALID_ORDER_DATE);

        // Mock behavior for supplier not found
        when(supplierAPIClient.getSupplierByName(eq("Nonexistent Supplier"), any(Pageable.class)))
                .thenReturn(Page.empty());

        // When & Then
        SupplierNotFoundException exception = assertThrows(
                SupplierNotFoundException.class,
                () -> orderCreateUseCase.createOrder(orderDTO, List.of())
        );

        assertEquals("Supplier with name Nonexistent Supplier does not exist.", exception.getMessage());
    }


}