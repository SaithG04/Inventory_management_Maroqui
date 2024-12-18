package ucv.app_inventory.application.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.adapters.outbounds.SupplierClient;
import ucv.app_inventory.adapters.repositories.ProductRepository;
import ucv.app_inventory.adapters.repositories.ProductSupplierRepository;
import ucv.app_inventory.application.DTO.ProductSupplierDTO;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.domain.entities.ProductSupplier;
import ucv.app_inventory.exception.InvalidFieldException;
import ucv.app_inventory.exception.ProductNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductSupplierServiceImpl implements ProductSupplierService {

    private final ProductSupplierRepository productSupplierRepository;
    private final SupplierClient supplierClient;
    private final ProductRepository productRepository;

    // Obtener los proveedores asociados a un producto
    public List<SupplierDTO> getSuppliersByProductId(Long productId) {
        // Obtener todas las relaciones de proveedores para el producto
        List<ProductSupplier> productSuppliers = productSupplierRepository.findByProductId(productId);

        // Si no hay relaciones, devolver una lista vacía
        if (productSuppliers.isEmpty()) {
            return List.of();
        }

        // Obtener los proveedores por sus IDs (a través del cliente Feign)
        return productSuppliers.stream()
                .map(productSupplier -> {
                    // Aquí estamos llamando al microservicio de proveedores con Feign para obtener el SupplierDTO
                    return supplierClient.getSupplierById(productSupplier.getSupplierId());
                })
                .collect(Collectors.toList());
    }

    // Agregar un proveedor a un producto
    public ProductSupplier addSupplierToProduct(ProductSupplierDTO productSupplierDTO) {

        Long supplierId = getSupplierId(productSupplierDTO);

        Long productId = productRepository.findProductByNameEquals(productSupplierDTO.getProductName())
                .orElseThrow(() -> new ProductNotFoundException("Product not found")).getId();

        // Verificar si la relación ya existe
        boolean exists = productSupplierRepository.existsByProductIdAndSupplierId(productId, supplierId);
        if (exists) {
            throw new InvalidFieldException("Supplier \"" + productSupplierDTO.getSupplierName()
                    + "\" is already associated with product \"" + productSupplierDTO.getProductName() + "\"");
        }

        // Crear la relación product-supplier con el precio
        ProductSupplier productSupplier = new ProductSupplier();
        productSupplier.setProductId(productId);
        productSupplier.setSupplierId(supplierId);
        productSupplier.setPrice(productSupplierDTO.getPrice());
        productSupplierRepository.save(productSupplier);
        return productSupplier;
    }

    // Eliminar un proveedor de un producto
    public void removeSupplierFromProduct(Long productId, String supplierName) {

        ProductSupplierDTO productSupplierDTO = new ProductSupplierDTO();
        productSupplierDTO.setSupplierName(supplierName);
        Long supplierId = getSupplierId(productSupplierDTO);

        // Buscar la relación entre el producto y el proveedor
        ProductSupplier productSupplier = productSupplierRepository.findByProductIdAndSupplierId(productId, supplierId);

        // Si la relación existe, eliminarla
        if (productSupplier != null) {
            productSupplierRepository.delete(productSupplier);
        }else {
            throw new InvalidFieldException("This product is not associated with supplier \"" + productSupplierDTO.getSupplierName() + "\"");
        }
    }

    @Override
    public boolean existsByProductAndSupplier(Long productId, Long supplierId) {
        return productSupplierRepository.existsByProductIdAndSupplierId(productId, supplierId);
    }

    @Override
    public List<ProductSupplier> getRelationsByProductId(Long productId) {
        return productSupplierRepository.findByProductId(productId);
    }

    @Override
    public List<ProductSupplier> getRelationsBySupplierId(Long supplierId) {
        return productSupplierRepository.findBySupplierId(supplierId);
    }

    @Override
    public ProductSupplier getRelationByProductAndSupplier(Long productId, Long supplierId) {
        return productSupplierRepository.findByProductIdAndSupplierId(productId, supplierId);
    }

    @Override
    public ProductSupplier getById(Long id) {
        return productSupplierRepository.findById(id).orElse(null);
    }

    @Override
    public List<SupplierDTO> getSuppliersByName(String name) {
        return supplierClient.getSuppliersByName(name, PageRequest.of(0, 15)).getContent();

    }

    @Override
    public void removeRelationsById(Long id){
        productSupplierRepository.findById(id).orElseThrow(() -> new InvalidFieldException("Relation not found"));
        productSupplierRepository.deleteById(id);
    }

    private Long getSupplierId(ProductSupplierDTO productSupplierDTO) {
        Pageable pageable = PageRequest.of(0, 1);
        Page<SupplierDTO> page = supplierClient.getSuppliersByName(productSupplierDTO.getSupplierName(), pageable);

        if(page == null || page.getTotalElements() == 0) {
            throw new InvalidFieldException("Supplier not found");
        }

        List<SupplierDTO> list = page.getContent();

        return list.getFirst().getId();
    }
}
