package ucv.app_inventory.application.services;

import ucv.app_inventory.domain.entities.Category;

import java.util.List;

public interface CategoryService {
    List<Category> listCategories();
    Category saveCategory(Category category);
    Category findCategoryById(Long id);
    void deleteCategory(Long id);
    Category findByName(String name);
}
