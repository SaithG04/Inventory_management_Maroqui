package ucv.app_inventory.supplier_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.supplier_service.domain.model.Supplier;
import ucv.app_inventory.supplier_service.exception.SupplierNotFoundException;
import ucv.app_inventory.supplier_service.infrastructure.outbound.database.SupplierMySqlRepository;

@Service
@RequiredArgsConstructor
public class SupplierDeleteUseCase {

    private final SupplierMySqlRepository supplierMySqlRepository;

    @Transactional
    public void deleteSupplier(Supplier supplier) {
        Long id = supplier.getId();
        if (!supplierMySqlRepository.existsById(id)) {
            throw new SupplierNotFoundException("Supplier with ID " + id + " not found");
        }
        supplierMySqlRepository.deleteById(id);
    }
}
