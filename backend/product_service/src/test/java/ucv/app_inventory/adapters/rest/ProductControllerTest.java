package ucv.app_inventory.adapters.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ucv.app_inventory.adapters.config.JwtAuthenticationFilter;
import ucv.app_inventory.adapters.config.JwtConfig;
import ucv.app_inventory.adapters.config.SecurityConfig;
import ucv.app_inventory.application.DTO.ProductDTO;
import ucv.app_inventory.application.services.ProductApplicationService;
import ucv.app_inventory.domain.entities.Product;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static ucv.app_inventory.domain.entities.Product.UnitMeasurement.UN;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductApplicationService productApplicationService;

    @MockBean
    private JwtConfig jwtConfig;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private String token;

    @BeforeEach
    void setUp() {

        // Configura correctamente el Mock para jwtConfig
        when(jwtConfig.getSecret()).thenReturn(jwtSecret);

        // Simulamos un token válido utilizando la misma clave secreta y algoritmo
        // 1 hora de expiración

        this.token = Jwts.builder()
                .setSubject("isai@miroqui.es")
                .claim("email", "isai@miroqui.es")
                .claim("roles", "ADMINISTRATOR")
                .claim("fullName", "isai")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600 * 1000))  // 1 hora de expiración
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS512)
                .compact(); // Asignamos el token a la variable global
    }

    /*@Test
    void testListProduct() throws Exception {
        // Imprimir la clave secreta que estás usando
        System.out.println("Secret from jwtConfig: " + jwtConfig.getSecret());
        ProductDTO productDto = new ProductDTO(1L, "Producto 1", "C001", "Descripción", UN, 100, 1L, Product.Status.ACTIVE);
        when(productApplicationService.listProducts(0, 15)).thenReturn(Arrays.asList(productDto));

        // Imprimir la clave secreta que estás usando
        System.out.println("Secret from jwtSecret: " + jwtSecret);

        mockMvc.perform(get("/api/product/listProducts?page=0&size=15")
                        .header("Authorization", "Bearer " + token))  // Usamos el token simulado
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Producto 1"));
    }

    @Test
    void testSaveProduct() throws Exception {
        ProductDTO productDto = new ProductDTO(null, "Nuevo Producto", "C002", "Descripción nueva", UN, 50, 1L, Product.Status.ACTIVE);
        ProductDTO savedProductDto = new ProductDTO(2L, "Nuevo Producto", "C002", "Descripción nueva", UN, 50, 1L, Product.Status.ACTIVE);

        when(productApplicationService.saveProduct(productDto)).thenReturn(savedProductDto);

        mockMvc.perform(post("/api/product/saveProduct")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDto))
                        .header("Authorization", "Bearer " + token))  // Usamos el token simulado
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Nuevo Producto"));
    }

    @Test
    void testDeleteProduct() throws Exception {
        doNothing().when(productApplicationService).deleteProduct(1L);

        mockMvc.perform(delete("/api/product/deleteProduct/1")
                        .header("Authorization", "Bearer " + token))  // Usamos el token simulado
                .andExpect(status().isNoContent());

        verify(productApplicationService, times(1)).deleteProduct(1L);
    }*/
}