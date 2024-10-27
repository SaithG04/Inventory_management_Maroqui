package ucv.app_inventory.order_service.audit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class AuditServiceTest {

    @Mock
    private AuditRepository auditRepository;

    @InjectMocks
    private AuditServiceImpl auditoriaServiceImpl;

    @BeforeEach
    public void setUp() {
        // Inicializa los mocks y la clase a probar
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void registrarAuditoria_deberiaGuardarEnRepositorio() {
        // Configurar datos de prueba
        String entidad = "Order";
        String accion = "CREAR";
        String usuario = "defaultUser";
        String detalle = "Order creado";

        // Invocar el método de servicio
        auditoriaServiceImpl.registrarAuditoria(entidad, accion, usuario, detalle);

        // Verificar que el repositorio ha guardado el evento de auditoría
        verify(auditRepository, times(1)).save(any(Audit.class));
    }

    @Test
    public void buscarPorId_deberiaRetornarAuditoria() {
        // Datos de prueba
        Audit audit = new Audit("Order", "CREAR", "defaultUser", "Order creado");
        when(auditRepository.findById(1L)).thenReturn(Optional.of(audit));

        // Invocar el método de servicio
        Optional<Audit> resultado = auditoriaServiceImpl.buscarPorId(1L);

        // Verificar que el valor retornado es correcto
        assertThat(resultado).isPresent();
        assertThat(resultado.get().getEntidad()).isEqualTo("Order");
        assertThat(resultado.get().getTipoAccion()).isEqualTo("CREAR");

        // Verificar que se ha invocado el método findById del repositorio
        verify(auditRepository, times(1)).findById(1L);
    }
}
