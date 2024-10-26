package ucv.app_inventory.order_service.aspect;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import ucv.app_inventory.order_service.audit.Auditoria;
import ucv.app_inventory.order_service.audit.AuditoriaRepository;
import ucv.app_inventory.order_service.domain.EstadoPedido;
import ucv.app_inventory.order_service.domain.Pedido;
import ucv.app_inventory.order_service.application.service.PedidoService;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@SpringBootTest(properties = "spring.profiles.active=test")
public class AuditoriaAspectIntegrationTest {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    @Test
    @WithMockUser(username = "testUser", roles = {"USER"})
    public void cuandoSeCreaUnPedido_debeRegistrarAuditoria() {
        // Datos de prueba
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setProveedorId(1L);
        nuevoPedido.setEstado(EstadoPedido.PENDIENTE);
        nuevoPedido.setTotal(500.0);
        nuevoPedido.setFecha(new Date());  // Asignar la fecha actual

        // Crear pedido
        pedidoService.crearPedido(nuevoPedido);

        // Verificar que se ha registrado un evento de auditoría
        List<Auditoria> auditorias = auditoriaRepository.findAll();
        assertThat(auditorias).hasSize(1);

        // Verificar detalles de la auditoría
        Auditoria auditoria = auditorias.getFirst();
        assertThat(auditoria.getEntidad()).isEqualTo("Pedido");
        assertThat(auditoria.getTipoAccion()).isEqualTo("CREAR");
        assertEquals("testUser", auditoria.getUsuario());

        // Verificación más específica del detalle
        assertThat(auditoria.getDetalle()).contains("proveedorId=1");
    }
}