package ucv.app_inventory.adapters.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucv.app_inventory.domain.entities.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findAll(Pageable pageable);
    //Page<Category> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Category> findByNameStartingWith(String name, Pageable pageable);
    Page<Category> findByStatus(Category.Status status, Pageable pageable);
    Page<Category> findByNameAndStatus(String name,Category.Status status, Pageable pageable);
}
