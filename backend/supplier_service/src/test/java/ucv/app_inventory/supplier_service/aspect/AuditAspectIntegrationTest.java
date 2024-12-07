package ucv.app_inventory.supplier_service.aspect;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import ucv.app_inventory.supplier_service.application.SupplierCreateUseCase;
import ucv.app_inventory.supplier_service.application.dto.SupplierDTO;
import ucv.app_inventory.supplier_service.audit.Audit;
import ucv.app_inventory.supplier_service.audit.AuditRepository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@SpringBootTest(properties = "spring.profiles.active=test")
public class AuditAspectIntegrationTest {

    @Autowired
    private SupplierCreateUseCase supplierCreateUseCase;

    @Autowired
    private AuditRepository auditRepository;

    @Test
    @WithMockUser(username = "testUser", roles = {"USER"})
    public void whenOrderIsCreated_shouldRecordAuditEntry() {
        // Test data for OrderDTO
        SupplierDTO newOrderDTO = new SupplierDTO();
        /*newOrderDTO.setSupplierId(1L);
        newOrderDTO.setStatus("PENDING");
        newOrderDTO.setTotalAmount(500.0);
        newOrderDTO.setOrderDate(new Date());*/

        // Create order using OrderDTO
        supplierCreateUseCase.createSupplier(newOrderDTO);

        // Verify that an audit event has been recorded
        List<Audit> audits = auditRepository.findAll();
        assertThat(audits).hasSize(1);

        // Verify audit details
        Audit audit = audits.get(0);
        assertThat(audit.getEntity()).isEqualTo("Supplier");
        assertThat(audit.getActionType()).isEqualTo("CREATE");
        assertEquals("testUser", audit.getUser());

        // More specific verification of audit details
        assertThat(audit.getDetails()).contains("supplierId=1");
    }
}
