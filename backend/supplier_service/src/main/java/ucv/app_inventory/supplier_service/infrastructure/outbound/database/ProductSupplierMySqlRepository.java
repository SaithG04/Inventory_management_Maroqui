package ucv.app_inventory.supplier_service.infrastructure.outbound.database;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ucv.app_inventory.supplier_service.domain.model.ProductSupplier;

@Repository
public interface ProductSupplierMySqlRepository extends JpaRepository<ProductSupplier, Long> {
    // Obtener todas las relaciones por ID del proveedor
    Page<ProductSupplier> findBySupplierId(Long supplierId, Pageable pageable);
    void deleteBySupplierId(Long supplierId);

}