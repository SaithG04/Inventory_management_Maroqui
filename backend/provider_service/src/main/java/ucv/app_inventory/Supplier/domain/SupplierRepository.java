package ucv.app_inventory.Supplier.domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Supplier findBySupplierId(Long id);

    List<Supplier> findByName(String name);

    List<Supplier> findByContact(String contact);

    List<Supplier> findByCategoryId(Long categoryId);

    List<Supplier> findByNameAndContact(String name, String contact);

    List<Supplier> findByNameAndCategoryId(String name, Long categoryId);

    List<Supplier> findByContactAndCategoryId(String contact, Long categoryId);

    List<Supplier> findByNameAndContactAndCategoryId(String name, String contact, Long categoryId);

    Supplier findByIdSupplier(Long supplierId);
}
