package ucv.app_inventory.application.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import ucv.app_inventory.application.DTO.ProductDTO;
import ucv.app_inventory.domain.entities.Product;

import java.util.Arrays;
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
        Product product = new Product(1L, "Producto 1", "C001", "Descripción", "unidad", 100, 1L, Product.Status.ACTIVE);
        List<Product> productList = Arrays.asList(product);
        Page<Product> productPage = new PageImpl<>(productList, PageRequest.of(0, 15), productList.size());

        when(productService.listProducts(0, 15)).thenReturn(productPage);

        List<ProductDTO> products = productApplicationService.listProducts(0, 15);

        System.out.println("Productos listados: " + products);

        assertNotNull(products);
        assertEquals(1, products.size());
        assertEquals("Producto 1", products.get(0).getName());
    }



    @Test
    void testSaveProduct() {

        ProductDTO productDto = new ProductDTO(null, "Nuevo Producto", "C002", "Descripción nueva", "unidad", 50, 1L, Product.Status.ACTIVE);
        Product product = new Product(2L, "Nuevo Producto", "C002", "Descripción nueva", "unidad", 50, 1L, Product.Status.ACTIVE);

        when(productService.saveProduct(any(Product.class))).thenReturn(product);


        ProductDTO savedProduct = productApplicationService.saveProduct(productDto);


        assertNotNull(savedProduct);
        assertEquals("Nuevo Producto", savedProduct.getName());

    }

    @Test
    void testFindProductById_NotFound() {

        when(productService.findProductById(1L)).thenReturn(null);


        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            productApplicationService.findProductById(1L);
        });

        assertEquals("El producto con id 1 no existe", thrown.getMessage());
    }



    @Test
    void testDeleteProduct() {
        doNothing().when(productService).deleteProduct(1L);

        productApplicationService.deleteProduct(1L);

        verify(productService, times(1)).deleteProduct(1L);
    }
}

