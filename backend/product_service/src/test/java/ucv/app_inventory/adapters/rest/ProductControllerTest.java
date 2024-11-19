package ucv.app_inventory.adapters.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ucv.app_inventory.application.DTO.ProductDTO;
import ucv.app_inventory.application.services.ProductApplicationService;
import ucv.app_inventory.domain.entities.Product;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)

class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductApplicationService productApplicationService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testListProduct() throws Exception {
        ProductDTO productDto = new ProductDTO(1L, "Producto 1", "C001", "Descripción", Product.UnitMeasurement.UN, 100, 1L, Product.Status.ACTIVE);
        when(productApplicationService.listProducts(0, 15)).thenReturn(Arrays.asList(productDto));

        mockMvc.perform(get("/api/product/listProducts?page=0&size=15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Producto 1"));
    }



    @Test
    void testSaveProduct() throws Exception {
        ProductDTO productDto = new ProductDTO(null, "Nuevo Producto", "C002", "Descripción nueva", Product.UnitMeasurement.UN, 50, 1L, Product.Status.ACTIVE);
        ProductDTO savedProductDto = new ProductDTO(2L, "Nuevo Producto", "C002", "Descripción nueva", Product.UnitMeasurement.UN, 50, 1L, Product.Status.ACTIVE);

        when(productApplicationService.saveProduct(productDto)).thenReturn(savedProductDto);

        mockMvc.perform(post("/api/product/saveProduct")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Nuevo Producto"));
    }

    // Test de eliminación de producto
    @Test
    void testDeleteProduct() throws Exception {
        doNothing().when(productApplicationService).deleteProduct(1L);

        mockMvc.perform(delete("/api/product/deleteProduct/1"))
                .andExpect(status().isNoContent());

        verify(productApplicationService, times(1)).deleteProduct(1L);
    }
}

