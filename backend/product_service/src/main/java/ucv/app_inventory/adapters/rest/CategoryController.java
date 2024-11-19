package ucv.app_inventory.adapters.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.application.DTO.CategoryDTO;
import ucv.app_inventory.application.services.CategoryApplicationService;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryApplicationService categoryApplicationService;

    @GetMapping("/list")
    public ResponseEntity<List<CategoryDTO>> listCategories() {
        List<CategoryDTO> categories = categoryApplicationService.listCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/save")
    public ResponseEntity<CategoryDTO> saveCategory(@RequestBody CategoryDTO categoryDto) {
        CategoryDTO savedCategory = categoryApplicationService.saveCategory(categoryDto);
        return ResponseEntity.ok(savedCategory);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> findCategoryById(@PathVariable Long id) {
        CategoryDTO categoryDto = categoryApplicationService.findCategoryById(id);
        return categoryDto != null ? ResponseEntity.ok(categoryDto) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryApplicationService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}