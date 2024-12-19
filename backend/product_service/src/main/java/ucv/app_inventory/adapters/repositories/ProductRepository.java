package ucv.app_inventory.adapters.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ucv.app_inventory.domain.entities.Product;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByStatus(Product.Status status, Pageable pageable);
    @Query("SELECT p FROM Product p JOIN Category c ON p.categoryId = c.id WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Product> findByCategoryName(@Param("name") String name, Pageable pageable);
    Page<Product> findAll(Pageable pageable);
    @Query("SELECT p.code FROM Product p ORDER BY p.id DESC LIMIT 1")
    String findLastProductCode();

    Optional<Product> findProductByNameEquals(String name);
}
