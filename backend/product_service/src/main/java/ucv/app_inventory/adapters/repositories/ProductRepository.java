package ucv.app_inventory.adapters.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucv.app_inventory.domain.entities.Product;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{
    List<Product> findAll();

    Product save(Product product);

    void deleteById(Integer id);

    Optional<Product> findById(Integer id);
}
