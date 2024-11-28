package ucv.app_inventory.order_service.audit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the AuditServiceImpl class, verifying the correct functionality of
 * audit event creation and retrieval.
 */
public class AuditServiceTest {

    @Mock
    private AuditRepository auditRepository;

    @InjectMocks
    private AuditServiceImpl auditServiceImpl;

    @BeforeEach
    public void setUp() {
        // Initialize mocks and the class under test
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void recordAudit_shouldSaveToRepository() {
        // Set up test data
        String entity = "Order";
        String action = "CREATE";
        String user = "defaultUser";
        String details = "Order created";

        // Invoke the service method
        auditServiceImpl.recordAudit(entity, action, user, details);

        // Verify that the repository has saved the audit event
        verify(auditRepository, times(1)).save(any(Audit.class));
    }

    @Test
    public void findById_shouldReturnAudit() {
        // Test data
        Audit audit = new Audit("Order", "CREATE", "defaultUser", "Order created");
        when(auditRepository.findById(1L)).thenReturn(Optional.of(audit));

        // Invoke the service method
        Optional<Audit> result = auditServiceImpl.findById(1L);

        // Verify that the returned value is correct
        assertThat(result).isPresent();
        assertThat(result.get().getEntity()).isEqualTo("Order");
        assertThat(result.get().getActionType()).isEqualTo("CREATE");

        // Verify that the repository's findById method was called
        verify(auditRepository, times(1)).findById(1L);
    }
}