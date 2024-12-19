/*package ucv.app_inventory.application.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import ucv.app_inventory.application.DTO.CategoryDTO;
import ucv.app_inventory.domain.entities.Category;
import ucv.app_inventory.domain.entities.Category.Status;
import ucv.app_inventory.exception.CategoryNotFoundException;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class CategoryApplicationServiceTest {

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryApplicationService categoryApplicationService;

    private Category category;
    private CategoryDTO categoryDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        category = new Category(1L, "Category 1", "Description 1", Status.ACTIVE);
        categoryDTO = new CategoryDTO(1L, "Category 1", "Description 1", Status.ACTIVE);
    }

    @Test
    void testSaveCategory() {
        // Arrange
        when(categoryService.createCategory(any(Category.class))).thenReturn(category);

        // Act
        CategoryDTO savedCategory = categoryApplicationService.saveCategory(categoryDTO);

        // Assert
        assertNotNull(savedCategory);
        assertEquals(categoryDTO.getName(), savedCategory.getName());
        verify(categoryService, times(1)).createCategory(any(Category.class));
    }

    @Test
    void testFindCategoryById() {
        // Arrange
        when(categoryService.findCategoryById(1L)).thenReturn(category);

        // Act
        CategoryDTO foundCategory = categoryApplicationService.findCategoryById(1L);

        // Assert
        assertNotNull(foundCategory);
        assertEquals(categoryDTO.getName(), foundCategory.getName());
        verify(categoryService, times(1)).findCategoryById(1L);
    }

    @Test
    void testFindCategoryById_NotFound() {
        // Arrange
        when(categoryService.findCategoryById(1L)).thenReturn(null);

        // Act
        CategoryDTO foundCategory = categoryApplicationService.findCategoryById(1L);

        // Assert
        assertNull(foundCategory);
        verify(categoryService, times(1)).findCategoryById(1L);
    }

    @Test
    void testDeleteCategory() {
        // Arrange
        when(categoryService.findCategoryById(1L)).thenReturn(category);
        doNothing().when(categoryService).deleteCategory(any(Category.class));

        // Act
        categoryApplicationService.deleteCategory(1L);

        // Assert
        verify(categoryService, times(1)).deleteCategory(any(Category.class));
    }

    @Test
    void testDeleteCategory_NotFound() {
        // Arrange
        when(categoryService.findCategoryById(1L)).thenReturn(null);

        // Act & Assert
        assertThrows(CategoryNotFoundException.class, () -> categoryApplicationService.deleteCategory(1L));
        verify(categoryService, times(1)).findCategoryById(1L);
    }

    @Test
    void testUpdateCategory() {
        // Arrange
        Category updatedCategory = new Category(1L, "Updated Category", "Updated Description", Status.INACTIVE);
        CategoryDTO updatedCategoryDTO = new CategoryDTO(1L, "Updated Category", "Updated Description", Status.INACTIVE);

        when(categoryService.findCategoryById(1L)).thenReturn(category);
        when(categoryService.updateCategory(any(Category.class))).thenReturn(updatedCategory);

        // Act
        CategoryDTO result = categoryApplicationService.updateCategory(1L, updatedCategoryDTO);

        // Assert
        assertNotNull(result);
        assertEquals(updatedCategoryDTO.getName(), result.getName());
        assertEquals(updatedCategoryDTO.getDescription(), result.getDescription());
        assertEquals(updatedCategoryDTO.getStatus(), result.getStatus());
        verify(categoryService, times(1)).findCategoryById(1L);
        verify(categoryService, times(1)).updateCategory(any(Category.class));
    }

    @Test
    void testListCategories() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 15);
        List<Category> categories = Arrays.asList(category);
        when(categoryService.listCategories(0, 15)).thenReturn(categories);

        // Act
        List<CategoryDTO> categoryDTOList = categoryApplicationService.listCategories(0, 15);

        // Assert
        assertNotNull(categoryDTOList);
        assertEquals(1, categoryDTOList.size());
        assertEquals(categoryDTO.getName(), categoryDTOList.get(0).getName());
        verify(categoryService, times(1)).listCategories(0, 15);
    }


    @Test
    void testFindByNameAndStatus() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 15);
        List<Category> categories = Arrays.asList(category);
        Page<Category> categoryPage = new PageImpl<>(categories);
        when(categoryService.findByNameAndStatus("Category", Status.ACTIVE, 0, 15)).thenReturn(categoryPage);

        // Act
        List<CategoryDTO> categoryDTOList = categoryApplicationService.findByNameAndStatus("Category", Status.ACTIVE, 0, 15);

        // Assert
        assertNotNull(categoryDTOList);
        assertEquals(1, categoryDTOList.size());
        assertEquals(categoryDTO.getName(), categoryDTOList.get(0).getName());
        verify(categoryService, times(1)).findByNameAndStatus("Category", Status.ACTIVE, 0, 15);
    }

    @Test
    void testFindByName() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 15);
        List<Category> categories = Arrays.asList(category);
        Page<Category> categoryPage = new PageImpl<>(categories);
        when(categoryService.findByName("Category", pageable)).thenReturn(categoryPage);

        // Act
        Page<CategoryDTO> categoryDTOPage = categoryApplicationService.findByName("Category", pageable);

        // Assert
        assertNotNull(categoryDTOPage);
        assertEquals(1, categoryDTOPage.getContent().size());
        assertEquals(categoryDTO.getName(), categoryDTOPage.getContent().get(0).getName());
        verify(categoryService, times(1)).findByName("Category", pageable);
    }

    @Test
    void testFindByStatus() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 15);
        List<Category> categories = Arrays.asList(category);
        Page<Category> categoryPage = new PageImpl<>(categories);
        when(categoryService.findByStatus(Status.ACTIVE, 0, 15)).thenReturn(categoryPage);

        // Act
        List<CategoryDTO> categoryDTOList = categoryApplicationService.findByStatus(Status.ACTIVE, 0, 15);

        // Assert
        assertNotNull(categoryDTOList);
        assertEquals(1, categoryDTOList.size());
        assertEquals(categoryDTO.getName(), categoryDTOList.get(0).getName());
        verify(categoryService, times(1)).findByStatus(Status.ACTIVE, 0, 15);
    }
}*/