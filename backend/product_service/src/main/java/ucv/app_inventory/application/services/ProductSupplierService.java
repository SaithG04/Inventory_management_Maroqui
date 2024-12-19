package ucv.app_inventory.application.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ucv.app_inventory.application.DTO.ProductSupplierDTO;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.domain.entities.ProductSupplier;

import java.util.List;

public interface ProductSupplierService {

    List<SupplierDTO> getSuppliersByProductId(Long productId);

    ProductSupplier addSupplierToProduct(ProductSupplierDTO productSupplierDTO);

    void removeSupplierFromProduct(Long productId, String supplierName);

    boolean existsByProductAndSupplier(Long productId, Long supplierId);

    List<ProductSupplier> getRelationsByProductId(Long productId);

    List<ProductSupplier> getRelationsBySupplierName(String supplierName);

    ProductSupplier getRelationByProductAndSupplier(Long productId, Long supplierId);

    ProductSupplier getById(Long id);

    void removeRelationsById(Long id);

}
