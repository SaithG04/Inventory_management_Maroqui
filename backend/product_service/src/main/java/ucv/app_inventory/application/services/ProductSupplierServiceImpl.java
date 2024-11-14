package ucv.app_inventory.application.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ucv.app_inventory.adapters.outbounds.SupplierClient;
import ucv.app_inventory.adapters.repositories.ProductSupplierRepository;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.domain.entities.ProductSupplier;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductSupplierServiceImpl implements ProductSupplierService {

    private final ProductSupplierRepository productSupplierRepository;
    private final SupplierClient supplierClient;

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
    public ProductSupplier addSupplierToProduct(Long productId, Long supplierId, Double price) {
        // Verificar si la relación ya existe
        boolean exists = productSupplierRepository.existsByProductIdAndSupplierId(productId, supplierId);
        if (exists) {
            // Si ya existe, no hacer nada
            return null;
        }

        // Crear la relación product-supplier con el precio
        ProductSupplier productSupplier = new ProductSupplier();
        productSupplier.setProductId(productId);
        productSupplier.setSupplierId(supplierId);
        productSupplier.setPrice(price);
        productSupplierRepository.save(productSupplier);
        return productSupplier;
    }

    // Eliminar un proveedor de un producto
    public void removeSupplierFromProduct(Long productId, Long supplierId) {
        // Buscar la relación entre el producto y el proveedor
        ProductSupplier productSupplier = productSupplierRepository.findByProductIdAndSupplierId(productId, supplierId);

        // Si la relación existe, eliminarla
        if (productSupplier != null) {
            productSupplierRepository.delete(productSupplier);
        }
    }
}
