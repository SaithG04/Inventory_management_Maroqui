/*package ucv.app_inventory.application.services;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import ucv.app_inventory.adapters.repositories.ProductSupplierRepository;
import ucv.app_inventory.adapters.outbounds.SupplierClient;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.domain.entities.ProductSupplier;
import java.util.List;


public class ProductSupplierServiceImplTest {

    @Mock
    private ProductSupplierRepository productSupplierRepository;

    @Mock
    private SupplierClient supplierClient;

    @InjectMocks
    private ProductSupplierServiceImpl productSupplierService;

    private Long productId;
    private Long supplierId;
    private Double price;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        productId = 1L;
        supplierId = 1L;
        price = 100.0;
    }

    // Test para agregar un proveedor a un producto
    @Test
    public void testAddSupplierToProduct_Success() {
        // Mock de comportamiento del repositorio
        when(productSupplierRepository.existsByProductIdAndSupplierId(productId, supplierId)).thenReturn(false);

        // Mock de cliente Feign
        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setId(supplierId);
        when(supplierClient.getSupplierById(supplierId)).thenReturn(supplierDTO);

        ProductSupplier result = productSupplierService.addSupplierToProduct(productId, supplierId, price);

        assertNotNull(result);
        assertEquals(productId, result.getProductId());
        assertEquals(supplierId, result.getSupplierId());
        assertEquals(price, result.getPrice());

        verify(productSupplierRepository).save(any(ProductSupplier.class));
    }

    @Test
    public void testAddSupplierToProduct_AlreadyExists() {
        // Mock para indicar que ya existe una relación
        when(productSupplierRepository.existsByProductIdAndSupplierId(productId, supplierId)).thenReturn(true);

        ProductSupplier result = productSupplierService.addSupplierToProduct(productId, supplierId, price);

        assertNull(result); // No se debe agregar la relación si ya existe

        verify(productSupplierRepository, times(0)).save(any(ProductSupplier.class));
    }


    // Test para eliminar un proveedor de un producto
    @Test
    public void testRemoveSupplierFromProduct_Success() {
        // Crear objeto de relación
        ProductSupplier productSupplier = new ProductSupplier();
        productSupplier.setProductId(productId);
        productSupplier.setSupplierId(supplierId);

        // Mock de la búsqueda de la relación
        when(productSupplierRepository.findByProductIdAndSupplierId(productId, supplierId)).thenReturn(productSupplier);

        productSupplierService.removeSupplierFromProduct(productId, supplierId);

        verify(productSupplierRepository).delete(productSupplier);
    }

    @Test
    public void testRemoveSupplierFromProduct_NotFound() {
        // Si no se encuentra la relación, no se debe eliminar
        when(productSupplierRepository.findByProductIdAndSupplierId(productId, supplierId)).thenReturn(null);

        productSupplierService.removeSupplierFromProduct(productId, supplierId);

        verify(productSupplierRepository, times(0)).delete(any(ProductSupplier.class)); // No debe llamar a delete
    }

    // Test para verificar la existencia de una relación
    @Test
    public void testExistsByProductAndSupplier_Success() {
        when(productSupplierRepository.existsByProductIdAndSupplierId(productId, supplierId)).thenReturn(true);

        boolean exists = productSupplierService.existsByProductAndSupplier(productId, supplierId);

        assertTrue(exists);
    }

    @Test
    public void testExistsByProductAndSupplier_NotFound() {
        when(productSupplierRepository.existsByProductIdAndSupplierId(productId, supplierId)).thenReturn(false);

        boolean exists = productSupplierService.existsByProductAndSupplier(productId, supplierId);

        assertFalse(exists);
    }

    @Test
    public void testGetRelationsByProductId() {
        ProductSupplier productSupplier = new ProductSupplier(1L, productId, supplierId, price);
        when(productSupplierRepository.findByProductId(productId)).thenReturn(List.of(productSupplier));

        List<ProductSupplier> relations = productSupplierService.getRelationsByProductId(productId);

        assertNotNull(relations);
        assertEquals(1, relations.size());
        assertEquals(productId, relations.get(0).getProductId());
    }

}*/

