package ucv.app_inventory.supplier_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.supplier_service.application.dto.SupplierDTO;
import ucv.app_inventory.supplier_service.domain.model.Supplier;
import ucv.app_inventory.supplier_service.domain.model.SupplierState;
import ucv.app_inventory.supplier_service.infrastructure.outbound.database.SupplierMySqlRepository;

@Service
@RequiredArgsConstructor
public class SupplierCreateUseCase {

    private final SupplierMySqlRepository supplierMySqlRepository;

    @Transactional
    public Supplier createSupplier(SupplierDTO supplierDTO) {
        // Crear la entidad Supplier
        Supplier supplier = new Supplier();
        setValues(supplierDTO, supplier);

        return supplierMySqlRepository.save(supplier);
    }

    public static void setValues(SupplierDTO supplierDTO, Supplier supplier) {
        supplier.setName(supplierDTO.getName());
        supplier.setContact(supplierDTO.getContact());
        supplier.setEmail(supplierDTO.getEmail());
        supplier.setPhone(supplierDTO.getPhone());
        supplier.setAddress(supplierDTO.getAddress());
        supplier.setConditions(supplierDTO.getConditions());
        supplier.setState(SupplierState.valueOf(supplierDTO.getState()));
    }

}
