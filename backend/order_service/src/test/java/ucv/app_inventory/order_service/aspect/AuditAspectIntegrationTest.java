package ucv.app_inventory.order_service.aspect;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import ucv.app_inventory.order_service.application.OrderCreateUseCase;
import ucv.app_inventory.order_service.audit.Audit;
import ucv.app_inventory.order_service.audit.AuditRepository;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.domain.model.Order;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@SpringBootTest(properties = "spring.profiles.active=test")
public class AuditAspectIntegrationTest {

    @Autowired
    private OrderCreateUseCase orderCreateUseCase;

    @Autowired
    private AuditRepository auditRepository;

    @Test
    @WithMockUser(username = "testUser", roles = {"USER"})
    public void cuandoSeCreaUnPedido_debeRegistrarAuditoria() {
        // Datos de prueba
        Order nuevoOrder = new Order();
        nuevoOrder.setProveedorId(1L);
        nuevoOrder.setEstado(OrderState.PENDIENTE);
        nuevoOrder.setTotal(500.0);
        nuevoOrder.setFecha(new Date());  // Asignar la fecha actual

        // Crear pedido
        orderCreateUseCase.crearPedido(nuevoOrder);

        // Verificar que se ha registrado un evento de auditoría
        List<Audit> audits = auditRepository.findAll();
        assertThat(audits).hasSize(1);

        // Verificar detalles de la auditoría
        Audit audit = audits.getFirst();
        assertThat(audit.getEntidad()).isEqualTo("Order");
        assertThat(audit.getTipoAccion()).isEqualTo("CREAR");
        assertEquals("testUser", audit.getUsuario());

        // Verificación más específica del detalle
        assertThat(audit.getDetalle()).contains("proveedorId=1");
    }
}