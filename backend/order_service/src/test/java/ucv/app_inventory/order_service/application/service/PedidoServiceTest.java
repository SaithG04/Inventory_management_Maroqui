package ucv.app_inventory.order_service.application.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import ucv.app_inventory.order_service.domain.EstadoPedido;
import ucv.app_inventory.order_service.domain.Pedido;
import ucv.app_inventory.order_service.infrastructure.repository.PedidoRepository;
import ucv.app_inventory.order_service.application.client.ProveedorClient;
import ucv.app_inventory.order_service.application.client.ProductoClient;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ProveedorClient proveedorClient;

    @Mock
    private ProductoClient productoClient;

    @InjectMocks
    private PedidoServiceImpl pedidoService;

    @BeforeEach
    void setUp() {
        // Inicializar los mocks
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void buscarPorId_deberiaDevolverPedido() {
        // Datos de prueba
        Pedido pedido = new Pedido();
        pedido.setId(1L);

        // Simulación
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        // Invocar método a probar
        Optional<Pedido> resultado = pedidoService.buscarPorId(1L);

        // Verificar el resultado
        assertThat(resultado).isPresent();
        assertThat(resultado.get().getId()).isEqualTo(1L);
        verify(pedidoRepository, times(1)).findById(1L);
    }

    @Test
    void buscarPorProveedorYEstado_deberiaDevolverListaFiltrada() {
        // Datos de prueba
        Page<Pedido> pedidos = new PageImpl<>(Arrays.asList(new Pedido(), new Pedido()));
        when(pedidoRepository.findByProveedorIdAndEstado(any(Long.class), any(EstadoPedido.class), any(PageRequest.class)))
                .thenReturn(pedidos);

        // Invocar método a probar
        Page<Pedido> resultado = pedidoService.buscarPedidosPorProveedorYEstado(1L, EstadoPedido.PROCESADO, PageRequest.of(0, 10));

        // Verificar el resultado
        assertThat(resultado.getContent().size()).isEqualTo(2);
        verify(pedidoRepository, times(1)).findByProveedorIdAndEstado(1L, EstadoPedido.PROCESADO, PageRequest.of(0, 10));
    }

    @Test
    void paginarPedidos_deberiaDevolverPaginaDePedidos() {
        // Datos de prueba: crear una lista de pedidos y envolverla en un objeto Page
        List<Pedido> pedidos = Arrays.asList(new Pedido(), new Pedido());
        Page<Pedido> paginaDePedidos = new PageImpl<>(pedidos);

        // Simular el comportamiento del repositorio
        when(pedidoRepository.findByFechaBetween(any(LocalDate.class), any(LocalDate.class), any(PageRequest.class)))
                .thenReturn(paginaDePedidos);

        // Invocar el método a probar
        Page<Pedido> resultado = pedidoService.buscarPedidosPorFecha(LocalDate.now(), LocalDate.now().plusDays(1), PageRequest.of(0, 10));

        // Verificar que el resultado no es nulo y contiene los elementos esperados
        assertThat(resultado).isNotNull();
        assertThat(resultado.getContent().size()).isEqualTo(2);  // Hay 2 pedidos en la lista

        // Verificar que se llamó al repositorio con los argumentos correctos
        verify(pedidoRepository, times(1)).findByFechaBetween(any(LocalDate.class), any(LocalDate.class), any(PageRequest.class));
    }

}
