package ucv.app_inventory.supplier_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.supplier_service.domain.model.SupplierState;
import ucv.app_inventory.supplier_service.domain.model.Supplier;
import ucv.app_inventory.supplier_service.infrastructure.outbound.database.SupplierMySqlRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupplierFindUseCase {

    private final SupplierMySqlRepository supplierMySqlRepository;

    public Optional<Supplier> findById(Long id) {
        return supplierMySqlRepository.findById(id);
    }

    public Page<Supplier> listAll(Pageable pageable) {
        return supplierMySqlRepository.findAll(pageable);
    }

    @Cacheable("supplierByStatus")
    public Page<Supplier> findSuppliersByStatus(SupplierState status, Pageable pageable) {
        return supplierMySqlRepository.findByState(status, pageable);
    }

    @Cacheable("supplierByName")
    public Page<Supplier> findSuppliersByName(String name, Pageable pageable) {
        return supplierMySqlRepository.findByNameStartingWith(name, pageable);
    }

}
