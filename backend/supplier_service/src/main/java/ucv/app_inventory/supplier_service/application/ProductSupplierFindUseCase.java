package ucv.app_inventory.supplier_service.application;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ucv.app_inventory.supplier_service.application.dto.ProductDTO;
import ucv.app_inventory.supplier_service.application.dto.ProductSupplierDTO;
import ucv.app_inventory.supplier_service.domain.model.ProductSupplier;
import ucv.app_inventory.supplier_service.domain.model.Supplier;
import ucv.app_inventory.supplier_service.infrastructure.outbound.database.ProductSupplierMySqlRepository;
import ucv.app_inventory.supplier_service.infrastructure.outbound.database.SupplierMySqlRepository;
import ucv.app_inventory.supplier_service.infrastructure.outbound.external.ProductAPIClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductSupplierFindUseCase {

    private final ProductSupplierMySqlRepository productSupplierMySqlRepository;
    private final SupplierMySqlRepository supplierMySqlRepository;
    private final ModelMapper modelMapper;
    private final ProductAPIClient productAPIClient;

    @Cacheable("productsBySupplierId")
    public Page<ProductSupplierDTO> findBySupplierId(Long id, Pageable pageable) {
        // Obtener la página de ProductSupplier
        Page<ProductSupplier> productSuppliersPage = productSupplierMySqlRepository.findBySupplierId(id, pageable);

        // Convertir la lista de ProductSupplier a ProductSupplierDTO
        List<ProductSupplierDTO> productSupplierDTOs = productSuppliersPage.getContent().stream()
                .map(productSupplier -> {
                    // Usar Feign para obtener el nombre del producto con caché
                    ProductDTO productDTO = productAPIClient.getProductById(productSupplier.getProductId());

                    // Mapear el ProductSupplier a ProductSupplierDTO
                    ProductSupplierDTO productSupplierDTO = modelMapper.map(productSupplier, ProductSupplierDTO.class);
                    productSupplierDTO.setProduct_name(productDTO.getName());
                    return productSupplierDTO;
                })
                .collect(Collectors.toList());

        // Retornar un Page de ProductSupplierDTO
        return new PageImpl<>(productSupplierDTOs, pageable, productSuppliersPage.getTotalElements());
    }


}
