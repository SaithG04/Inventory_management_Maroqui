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
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByStatus(Product.Status status);
    @Query("SELECT p FROM Product p JOIN Category c ON p.categoryId = c.id WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> findByCategoryName(@Param("name") String name);
    Page<Product> findAll(Pageable pageable);
}
