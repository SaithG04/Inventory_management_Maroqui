package ucv.app_inventory.order_service.application.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import ucv.app_inventory.order_service.application.OrderFindUseCase;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProviderAPIClient;
import ucv.app_inventory.order_service.infrastructure.outbound.external.ProductAPIClient;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    @Mock
    private OrderMySqlRepository orderMySqlRepository;

    @Mock
    private ProviderAPIClient providerAPIClient;

    @Mock
    private ProductAPIClient productAPIClient;

    @InjectMocks
    private OrderFindUseCase orderFindUseCase;

    @BeforeEach
    void setUp() {
        // Inicializar los mocks
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void buscarPorId_deberiaDevolverPedido() {
        // Datos de prueba
        Order order = new Order();
        order.setId(1L);

        // Simulación
        when(orderMySqlRepository.findById(1L)).thenReturn(Optional.of(order));

        // Invocar método a probar
        Optional<Order> resultado = orderFindUseCase.buscarPorId(1L);

        // Verificar el resultado
        assertThat(resultado).isPresent();
        assertThat(resultado.get().getId()).isEqualTo(1L);
        verify(orderMySqlRepository, times(1)).findById(1L);
    }

    @Test
    void buscarPorProveedorYEstado_deberiaDevolverListaFiltrada() {
        // Datos de prueba
        Page<Order> pedidos = new PageImpl<>(Arrays.asList(new Order(), new Order()));
        when(orderMySqlRepository.findByProveedorIdAndEstado(any(Long.class), any(OrderState.class), any(PageRequest.class)))
                .thenReturn(pedidos);

        // Invocar método a probar
        Page<Order> resultado = orderFindUseCase.buscarPedidosPorProveedorYEstado(1L, OrderState.PROCESADO, PageRequest.of(0, 10));

        // Verificar el resultado
        assertThat(resultado.getContent().size()).isEqualTo(2);
        verify(orderMySqlRepository, times(1)).findByProveedorIdAndEstado(1L, OrderState.PROCESADO, PageRequest.of(0, 10));
    }

    @Test
    void paginarPedidos_deberiaDevolverPaginaDePedidos() {
        // Datos de prueba: crear una lista de orders y envolverla en un objeto Page
        List<Order> orders = Arrays.asList(new Order(), new Order());
        Page<Order> paginaDePedidos = new PageImpl<>(orders);

        // Simular el comportamiento del repositorio
        when(orderMySqlRepository.findByFechaBetween(any(Date.class), any(Date.class), any(PageRequest.class)))
                .thenReturn(paginaDePedidos);

        // Usamos LocalDate para trabajar con las fechas
        LocalDate hoy = LocalDate.now();
        LocalDate manana = hoy.plusDays(1);

        // Convertimos LocalDate a Date
        Date fechaInicio = Date.from(hoy.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date fechaFin = Date.from(manana.atStartOfDay(ZoneId.systemDefault()).toInstant());

        // Invocar el método a probar
        Page<Order> resultado = orderFindUseCase.buscarPedidosPorFecha(fechaInicio, fechaFin, PageRequest.of(0, 10));

        // Verificar que el resultado no es nulo y contiene los elementos esperados
        assertThat(resultado).isNotNull();
        assertThat(resultado.getContent().size()).isEqualTo(2);  // Hay 2 orders en la lista

        // Verificar que se llamó al repositorio con los argumentos correctos
        verify(orderMySqlRepository, times(1)).findByFechaBetween(any(Date.class), any(Date.class), any(PageRequest.class));
    }
}
