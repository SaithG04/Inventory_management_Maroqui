package ucv.app_inventory.application.services;

import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.domain.entities.ProductSupplier;

import java.util.List;

public interface ProductSupplierService {

    List<SupplierDTO> getSuppliersByProductId(Long productId);

    ProductSupplier addSupplierToProduct(Long productId, Long supplierId, Double price);

    void removeSupplierFromProduct(Long productId, Long supplierId);

    boolean existsByProductAndSupplier(Long productId, Long supplierId);

    List<ProductSupplier> getRelationsByProductId(Long productId);

    List<ProductSupplier> getRelationsBySupplierId(Long supplierId);

    ProductSupplier getRelationByProductAndSupplier(Long productId, Long supplierId);

    ProductSupplier getById(Long id);


}
