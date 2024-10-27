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
        ProductDTO productDto = new ProductDTO(1, "Producto 1", "C001", "Descripción", 10.0, "unidad", "100", 1, 1);
        when(productApplicationService.listProducts()).thenReturn(List.of(productDto));

        mockMvc.perform(get("/api/product/listProducts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Producto 1"));
    }

    @Test
    void testSaveProduct() throws Exception {
        ProductDTO productDto = new ProductDTO(null, "Nuevo Producto", "C002", "Descripción nueva", 20.0, "unidad", "50", 1, 2);
        ProductDTO savedProductDto = new ProductDTO(2, "Nuevo Producto", "C002", "Descripción nueva", 20.0, "unidad", "50", 1, 2);

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
        doNothing().when(productApplicationService).deleteProduct(1);

        mockMvc.perform(delete("/api/product/deleteProduct/1"))
                .andExpect(status().isNoContent());

        verify(productApplicationService, times(1)).deleteProduct(1);
    }
}

