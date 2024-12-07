package ucv.app_inventory.supplier_service.application.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import ucv.app_inventory.supplier_service.application.SupplierFindUseCase;
import ucv.app_inventory.supplier_service.domain.model.SupplierState;
import ucv.app_inventory.supplier_service.domain.model.Supplier;
import ucv.app_inventory.supplier_service.infrastructure.outbound.database.SupplierMySqlRepository;
import ucv.app_inventory.supplier_service.infrastructure.outbound.external.ProductAPIClient;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the SupplierFindUseCase service, covering methods to find orders by various criteria.
 * Uses Mockito to mock dependencies and Spring Data's Page for pagination.
 */
class SupplierServiceTest {

    @Mock
    private SupplierMySqlRepository supplierMySqlRepository;

    @Mock
    private ProviderAPIClient providerAPIClient;

    @Mock
    private ProductAPIClient productAPIClient;

    @InjectMocks
    private SupplierFindUseCase supplierFindUseCase;

    @BeforeEach
    void setUp() {
        // Initialize mocks before each test
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findById_shouldReturnOrder() {
        // Test data
        Supplier supplier = new Supplier();
        supplier.setId(1L);

        // Mock behavior
        when(supplierMySqlRepository.findById(1L)).thenReturn(Optional.of(supplier));

        // Invoke method under test
        Optional<Supplier> result = supplierFindUseCase.findById(1L);

        // Verify results
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        verify(supplierMySqlRepository, times(1)).findById(1L);
    }

    @Test
    void findOrdersBySupplierAndStatus_shouldReturnFilteredList() {
        // Test data
        Page<Supplier> orders = new PageImpl<>(Arrays.asList(new Supplier(), new Supplier()));
        when(supplierMySqlRepository.findBySupplierIdAndStatus(any(Long.class), any(SupplierState.class), any(PageRequest.class)))
                .thenReturn(orders);

        // Invoke method under test
        Page<Supplier> result = supplierFindUseCase.findOrdersBySupplierAndStatus(1L, SupplierState.PROCESSED, PageRequest.of(0, 10));

        // Verify results
        assertThat(result.getContent().size()).isEqualTo(2);
        verify(supplierMySqlRepository, times(1)).findBySupplierIdAndStatus(1L, SupplierState.PROCESSED, PageRequest.of(0, 10));
    }

    @Test
    void paginateOrders_shouldReturnPageOfOrders() {
        // Test data: create a list of suppliers and wrap in a Page object
        List<Supplier> suppliers = Arrays.asList(new Supplier(), new Supplier());
        Page<Supplier> pageOfOrders = new PageImpl<>(suppliers);

        // Mock repository behavior
        when(supplierMySqlRepository.findByOrderDateBetween(any(LocalDate.class), any(LocalDate.class), any(PageRequest.class)))
                .thenReturn(pageOfOrders);

        // Use LocalDate for date handling
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        // Invoke method under test
        Page<Supplier> result = supplierFindUseCase.findOrdersByDate(today, tomorrow, PageRequest.of(0, 10));

        // Verify that the result is not null and contains expected elements
        assertThat(result).isNotNull();
        assertThat(result.getContent().size()).isEqualTo(2);  // Contains 2 suppliers in the list

        // Verify the repository was called with correct arguments
        verify(supplierMySqlRepository, times(1)).findByOrderDateBetween(today, tomorrow, PageRequest.of(0, 10));
    }

}
