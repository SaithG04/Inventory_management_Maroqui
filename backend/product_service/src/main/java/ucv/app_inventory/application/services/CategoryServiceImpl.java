package ucv.app_inventory.application.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.adapters.repositories.CategoryRepository;
import ucv.app_inventory.domain.entities.Category;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> listCategories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return categoryRepository.findAll(pageable).getContent();
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category findCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteCategory(Category category) {
        Long id = category.getId();
        categoryRepository.deleteById(id);
    }

    @Override
    public Page<Category> findByName(String name, Pageable pageable) {
        return categoryRepository.findByNameStartingWith(name, pageable);
    }

    @Override
    public Page<Category> findByStatus(Category.Status status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return categoryRepository.findByStatus(status, pageable);
    }

    @Override
    public Page<Category> findByNameAndStatus(String name, Category.Status status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return categoryRepository.findByNameAndStatus(name, status, pageable);
    }

    @Override
    public Long findIdByName(String name) {
        return categoryRepository.findByNameStartingWith(name, Pageable.unpaged())
                .stream()
                .findFirst()
                .map(Category::getId)
                .orElse(null);
    }

}
