package ucv.app_inventory.application.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.application.DTO.CategoryDTO;
import ucv.app_inventory.domain.entities.Category;
import ucv.app_inventory.domain.entities.Product;
import ucv.app_inventory.exception.CategoryNotFoundException;
import ucv.app_inventory.exception.ProductNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryApplicationService {

    private final CategoryService categoryService;
    private static final Logger logger = LoggerFactory.getLogger(CategoryApplicationService.class);


    public CategoryApplicationService(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    public List<CategoryDTO> listCategories(int page, int size) {
        return categoryService.listCategories(page, size).stream().map(this::convertToDto).toList();
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDto) {
        Category categoryToUpdate = categoryService.findCategoryById(id);
        if (categoryToUpdate == null) {
            return null;
        }


        if (categoryDto.getName() != null) {
            categoryToUpdate.setName(categoryDto.getName());
        }
        if (categoryDto.getDescription() != null) {
            categoryToUpdate.setDescription(categoryDto.getDescription());
        }
        if (categoryDto.getStatus() != null) {
            categoryToUpdate.setStatus(categoryDto.getStatus());
        }

        Category updatedCategory = categoryService.updateCategory(categoryToUpdate);
        return convertToDto(updatedCategory);
    }


    public CategoryDTO saveCategory(CategoryDTO categoryDto) {
        Category category = convertToEntity(categoryDto);
        Category savedCategory = categoryService.createCategory(category);
        return convertToDto(savedCategory);
    }

    public CategoryDTO findCategoryById(Long id) {
        Category category = categoryService.findCategoryById(id);
        return category != null ? convertToDto(category) : null;
    }

    public void deleteCategory(Long id) {
        getInfo(id);
        Category category = categoryService.findCategoryById(id);
        if (category == null) {
            getWarn(id);
            throw new CategoryNotFoundException("Categoría no encontrada con id: " + id);
        }
        logger.info("Deleting category");
        categoryService.deleteCategory(category);
        logger.info("Category deleted");
    }

    private static void getWarn(Long id) {
        logger.warn("Categoría no encontrada con id: {}", id);
    }

    private static void getInfo(Long id) {
        logger.info("Buscando categoría por id: {}", id);
    }

    private CategoryDTO convertToDto(Category category) {
        return new CategoryDTO(category.getId(), category.getName(), category.getDescription(), category.getStatus());
    }

    private Category convertToEntity(CategoryDTO categoryDto) {
        return new Category(categoryDto.getId(), categoryDto.getName(), categoryDto.getDescription(), categoryDto.getStatus());
    }

    public Page<CategoryDTO> findByName(String name, Pageable pageable) {
        return categoryService.findByName(name, pageable).map(this::convertToDto);
    }

    public List<CategoryDTO> findByStatus(Category.Status status, int page, int size) {
        return categoryService.findByStatus(status, page, size).stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<CategoryDTO> findByNameAndStatus(String name, Category.Status status, int page, int size) {
        return categoryService.findByNameAndStatus(name, status, page, size).stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public Long getCategoryIdByName(String name) {
        return categoryService.findIdByName(name);
    }


}
