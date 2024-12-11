package ucv.app_inventory.application.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ucv.app_inventory.domain.entities.Category;

import java.util.List;

public interface CategoryService {
    List<Category> listCategories(int page, int size);
    Category createCategory(Category category);
    Category updateCategory(Category category);
    Category findCategoryById(Long id);
    void deleteCategory(Category category);
    Page<Category> findByName(String name, Pageable pageable);
    Page<Category> findByStatus(Category.Status status, int page, int size);
    Page<Category> findByNameAndStatus(String name, Category.Status status, int page, int size);
}
