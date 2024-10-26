package ucv.app_inventory.order_service.audit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class AuditoriaServiceTest {

    @Mock
    private AuditoriaRepository auditoriaRepository;

    @InjectMocks
    private AuditoriaServiceImpl auditoriaServiceImpl;

    @BeforeEach
    public void setUp() {
        // Inicializa los mocks y la clase a probar
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void registrarAuditoria_deberiaGuardarEnRepositorio() {
        // Configurar datos de prueba
        String entidad = "Pedido";
        String accion = "CREAR";
        String usuario = "defaultUser";
        String detalle = "Pedido creado";

        // Invocar el método de servicio
        auditoriaServiceImpl.registrarAuditoria(entidad, accion, usuario, detalle);

        // Verificar que el repositorio ha guardado el evento de auditoría
        verify(auditoriaRepository, times(1)).save(any(Auditoria.class));
    }

    @Test
    public void buscarPorId_deberiaRetornarAuditoria() {
        // Datos de prueba
        Auditoria auditoria = new Auditoria("Pedido", "CREAR", "defaultUser", "Pedido creado");
        when(auditoriaRepository.findById(1L)).thenReturn(Optional.of(auditoria));

        // Invocar el método de servicio
        Optional<Auditoria> resultado = auditoriaServiceImpl.buscarPorId(1L);

        // Verificar que el valor retornado es correcto
        assertThat(resultado).isPresent();
        assertThat(resultado.get().getEntidad()).isEqualTo("Pedido");
        assertThat(resultado.get().getTipoAccion()).isEqualTo("CREAR");

        // Verificar que se ha invocado el método findById del repositorio
        verify(auditoriaRepository, times(1)).findById(1L);
    }
}
