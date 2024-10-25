package ucv.app_inventory.application.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import ucv.app_inventory.application.DTO.ProductDTO;
import ucv.app_inventory.domain.entities.Product;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductApplicationServiceTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductApplicationService productApplicationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testListProducts() {

        Product product = new Product(1, "Producto 1", "C001", "Descripción", 10.0, "unidad", "100", 1, 1);
        when(productService.listProducts()).thenReturn(List.of(product));


        List<ProductDTO> products = productApplicationService.listProducts();


        System.out.println("Productos listados: " + products);


        assertNotNull(products);
        assertEquals(1, products.size());
        assertEquals("Producto 1", products.get(0).getName());
    }

    @Test
    void testSaveProduct() {

        ProductDTO productDto = new ProductDTO(null, "Nuevo Producto", "C002", "Descripción nueva", 20.0, "unidad", "50", 1, 2);
        Product product = new Product(2, "Nuevo Producto", "C002", "Descripción nueva", 20.0, "unidad", "50", 1, 2);

        when(productService.saveProduct(any(Product.class))).thenReturn(product);


        ProductDTO savedProduct = productApplicationService.saveProduct(productDto);


        assertNotNull(savedProduct);
        assertEquals("Nuevo Producto", savedProduct.getName());
        assertEquals(20.0, savedProduct.getCostPrice());
    }

    @Test
    void testFindProductById_NotFound() {

        when(productService.findProductById(1)).thenReturn(null);


        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            productApplicationService.findProductById(1);
        });

        assertEquals("El producto con id 1 no existe", thrown.getMessage());
    }



    @Test
    void testDeleteProduct() {
        doNothing().when(productService).deleteProduct(1);

        productApplicationService.deleteProduct(1);

        verify(productService, times(1)).deleteProduct(1);
    }
}

