package ucv.app_inventory.application.services;

import org.springframework.stereotype.Service;
import ucv.app_inventory.application.DTO.CategoryDTO;
import ucv.app_inventory.domain.entities.Category;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryApplicationService {
    private final CategoryService categoryService;

    public CategoryApplicationService(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    public List<CategoryDTO> listCategories() {
        return categoryService.listCategories().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public CategoryDTO saveCategory(CategoryDTO categoryDto) {
        Category category = convertToEntity(categoryDto);
        Category savedCategory = categoryService.saveCategory(category);
        return convertToDto(savedCategory);
    }

    public CategoryDTO findCategoryById(Long id) {
        Category category = categoryService.findCategoryById(id);
        return category != null ? convertToDto(category) : null;
    }

    public void deleteCategory(Long id) {
        categoryService.deleteCategory(id);
    }

    private CategoryDTO convertToDto(Category category) {
        return new CategoryDTO(category.getId(), category.getName(), category.getDescription(), category.getStatus());
    }

    private Category convertToEntity(CategoryDTO categoryDto) {
        return new Category(categoryDto.getId(), categoryDto.getName(), categoryDto.getDescription(), categoryDto.getStatus());
    }
}
