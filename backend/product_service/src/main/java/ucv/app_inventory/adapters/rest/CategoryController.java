package ucv.app_inventory.adapters.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.application.DTO.CategoryDTO;
import ucv.app_inventory.application.services.CategoryApplicationService;
import ucv.app_inventory.domain.entities.Category;

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

    @PutMapping("/update/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryDTO categoryDto) {
        CategoryDTO updatedCategory = categoryApplicationService.updateCategory(id, categoryDto);
        return updatedCategory != null ? ResponseEntity.ok(updatedCategory) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search/name")
    public ResponseEntity<Page<CategoryDTO>> findByName(
            @RequestParam String name,
            @RequestParam int page,
            @RequestParam int size) {
        Page<CategoryDTO> categories = categoryApplicationService.findByName(name, page, size);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/search/status")
    public ResponseEntity<Page<CategoryDTO>> findByStatus(
            @RequestParam Category.Status status,
            @RequestParam int page,
            @RequestParam int size) {
        Page<CategoryDTO> categories = categoryApplicationService.findByStatus(status, page, size);
        return ResponseEntity.ok(categories);
    }



}
