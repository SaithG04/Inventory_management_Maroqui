package ucv.app_inventory.adapters.repositories;

import org.springframework.stereotype.Repository;
import ucv.app_inventory.domain.entities.ProductSupplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface ProductSupplierRepository extends JpaRepository<ProductSupplier, Long> {
    // Obtener todas las relaciones por ID del producto
    List<ProductSupplier> findByProductId(Long productId);

    // Obtener todas las relaciones por ID del proveedor
    List<ProductSupplier> findBySupplierId(Long supplierId);

    // Verificar si existe una relación entre un producto y un proveedor
    boolean existsByProductIdAndSupplierId(Long productId, Long supplierId);

    // Buscar una relación por ID del producto y proveedor
    ProductSupplier findByProductIdAndSupplierId(Long productId, Long supplierId);

}