package ucv.app_inventory.application.services;

import org.springframework.data.domain.Page;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.domain.entities.Product;

import java.util.List;

public interface ProductService {

    Page<Product> listProducts(int page, int size);

    Product saveProduct(final Product product);

    void deleteProduct(final Long id);

    Product findProductById(final Long id);

    Page<Product> findProductsByName(String name, int page, int size);

    Page<Product> findProductsByStatus(Product.Status status, int page, int size);

    Page<Product> findProductsByCategoryName(String categoryName, int page, int size);

    SupplierDTO getSupplierDetails(Long supplierId);

    List<SupplierDTO> getSuppliersForProduct(Long productId);

}
