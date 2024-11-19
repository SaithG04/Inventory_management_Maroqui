package ucv.app_inventory.application.services;

import org.springframework.data.domain.Page;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.domain.entities.Product;

import java.util.List;

public interface ProductService {

    Page<Product> listProducts(int page, int size);;

    Product saveProduct(final Product product);

    void deleteProduct(final Long id);

    Product findProductById(final Long id);

    List<Product> findProductsByName(String name);

    List<Product> findProductsByStatus(Product.Status status);

    List<Product> findProductsByCategoryName(String categoryName);

    SupplierDTO getSupplierDetails(Long supplierId);

    List<SupplierDTO> getSuppliersForProduct(Long productId);
}
