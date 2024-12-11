package ucv.app_inventory.supplier_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.supplier_service.application.dto.SupplierDTO;
import ucv.app_inventory.supplier_service.domain.model.Supplier;
import ucv.app_inventory.supplier_service.exception.SupplierNotFoundException;
import ucv.app_inventory.supplier_service.infrastructure.outbound.database.SupplierMySqlRepository;


@Service
@RequiredArgsConstructor
public class SupplierUpdateUseCase {

    private final SupplierMySqlRepository supplierMySqlRepository;

    @Transactional
    public Supplier updateSupplier(Long id, SupplierDTO supplierDTO) {
        return supplierMySqlRepository.findById(id).map(supplier -> {

            SupplierCreateUseCase.setValues(supplierDTO, supplier);

            return supplier;
        }).orElseThrow(() -> new SupplierNotFoundException("Supplier with ID " + id + " not found"));
    }

}
