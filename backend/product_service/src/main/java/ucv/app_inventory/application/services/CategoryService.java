package ucv.app_inventory.application.services;

import org.springframework.data.domain.Page;
import ucv.app_inventory.domain.entities.Category;

import java.util.List;

public interface CategoryService {
    List<Category> listCategories();
    Category saveCategory(Category category);
    Category findCategoryById(Long id);
    void deleteCategory(Long id);
    Page<Category> findByName(String name, int page, int size);
    Page<Category> findByStatus(Category.Status status, int page, int size);
}
