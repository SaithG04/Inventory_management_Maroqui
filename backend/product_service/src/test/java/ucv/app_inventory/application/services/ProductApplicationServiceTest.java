/*package ucv.app_inventory.application.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import ucv.app_inventory.adapters.outbounds.SupplierClient;
import ucv.app_inventory.adapters.repositories.ProductRepository;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.domain.entities.Product;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class ProductApplicationServiceTest {

    @InjectMocks
    private ProductServiceImpl productService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SupplierClient supplierClient;

    private Product product;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

    }

    //Test para listar producto
    @Test
    public void testListProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> mockPage = new PageImpl<>(List.of(new Product(1L, "Product1", "PRO001", "Description", Product.UnitMeasurement.UN, 100, 20.0, 1L, Product.Status.ACTIVE)));

        when(productRepository.findAll(pageable)).thenReturn(mockPage);

        Page<Product> result = productService.listProducts(0, 10);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }


    //Test para crear producto
    @Test
    public void testCreateProduct() {
        Product product = new Product(null, "Product1", "PRO001", "Description", Product.UnitMeasurement.UN, 100, 20.0, 1L, Product.Status.ACTIVE);
        Product savedProduct = new Product(1L, "Product1", "PRO001", "Description", Product.UnitMeasurement.UN, 100, 20.0, 1L, Product.Status.ACTIVE);

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.createProduct(product);

        assertNotNull(result);
        assertEquals("PRO001", result.getCode());
        verify(productRepository).save(product);
    }

    //Test para actualizar producto
    @Test
    public void testUpdateProduct() {
        Product product = new Product(1L, "Product1", "PRO002", "Description", Product.UnitMeasurement.UN, 100, 20.0, 1L, Product.Status.ACTIVE);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product updatedProduct = productService.updateProduct(product);

        assertNotNull(updatedProduct);
        assertEquals("Product1", updatedProduct.getName());
        verify(productRepository).save(product);
    }

    //Test para buscar producto por ID
    @Test
    public void testFindProductById() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product foundProduct = productService.findProductById(1L);

        assertNotNull(foundProduct);
        assertEquals("Product 1", foundProduct.getName());
    }

    //Test para eliminar producto
    @Test
    public void testDeleteProduct() {
        Product product = new Product(1L, "Product1", "PRO001", "Description", Product.UnitMeasurement.UN, 100, 20.0, 1L, Product.Status.ACTIVE);
        doNothing().when(productRepository).deleteById(anyLong());

        productService.deleteProduct(product);

        verify(productRepository).deleteById(1L);
    }


    //Test para buscar producto por nombre
    @Test
    public void testFindProductsByName() {
        String name = "Product";
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> productPage = mock(Page.class);
        when(productRepository.findByNameContainingIgnoreCase(name, pageable)).thenReturn(productPage);

        Page<Product> foundProducts = productService.findProductsByName(name, 0, 10);

        assertNotNull(foundProducts);
        verify(productRepository, times(1)).findByNameContainingIgnoreCase(name, pageable);
    }

    //Test para obtener detalles de proveedor
    @Test
    public void testGetSupplierDetails() {
        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setId(1L);
        when(supplierClient.getSupplierById(1L)).thenReturn(supplierDTO);

        SupplierDTO foundSupplier = productService.getSupplierDetails(1L);

        assertNotNull(foundSupplier);
        assertEquals(Long.valueOf(1L), foundSupplier.getId());
    }

}*/

