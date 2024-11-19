package ucv.app_inventory.order_service.aspect;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import ucv.app_inventory.order_service.application.OrderCreateUseCase;
import ucv.app_inventory.order_service.audit.Audit;
import ucv.app_inventory.order_service.audit.AuditRepository;
import ucv.app_inventory.order_service.application.dto.OrderDTO;

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
    public void whenOrderIsCreated_shouldRecordAuditEntry() {
        // Test data for OrderDTO
        OrderDTO newOrderDTO = new OrderDTO();
        newOrderDTO.setSupplierId(1L);
        newOrderDTO.setStatus("PENDING");
        newOrderDTO.setOrderDate("2024-12-12");

        // Create order using OrderDTO
        orderCreateUseCase.createOrder(newOrderDTO);

        // Verify that an audit event has been recorded
        List<Audit> audits = auditRepository.findAll();
        assertThat(audits).hasSize(1);

        // Verify audit details
        Audit audit = audits.get(0);
        assertThat(audit.getEntity()).isEqualTo("Order");
        assertThat(audit.getActionType()).isEqualTo("CREATE");
        assertEquals("testUser", audit.getUser());

        // More specific verification of audit details
        assertThat(audit.getDetails()).contains("supplierId=1");
    }
}
