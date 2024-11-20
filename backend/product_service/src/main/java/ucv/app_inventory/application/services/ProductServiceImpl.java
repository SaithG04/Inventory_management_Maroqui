package ucv.app_inventory.application.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.adapters.outbounds.SupplierClient;
import ucv.app_inventory.adapters.repositories.ProductRepository;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.domain.entities.Product;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService{
    private final ProductRepository productRepository;
    private final SupplierClient supplierClient;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, SupplierClient supplierClient) {
        this.productRepository = productRepository;
        this.supplierClient = supplierClient;
    }

    @Override
    public Page<Product> listProducts(int page, int size) {
        return productRepository.findAll(PageRequest.of(page, size));
    }

    @Override
    public Product saveProduct(Product product) {
        if (product.getCode() == null || product.getCode().isEmpty()) {
            product.setCode(getNextProductCode());
        }
        if (product.getStock() == null) {
            product.setStock(0);
        }
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public Product findProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }


    @Override
    public Page<Product> findProductsByName(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    @Override
    public Page<Product> findProductsByStatus(Product.Status status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByStatus(status, pageable);
    }

    @Override
    public Page<Product> findProductsByCategoryName(String categoryName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategoryName(categoryName, pageable);
    }

    @Override
    public SupplierDTO getSupplierDetails(Long supplierId) {
        return supplierClient.getSupplierById(supplierId);
    }

    @Override
    @Cacheable(value = "suppliers", key = "#productId")
    public List<SupplierDTO> getSuppliersForProduct(Long productId) {
        return supplierClient.getSuppliersByProductId(productId);
    }

    public String getNextProductCode() {
        String lastCode = productRepository.findLastProductCode();
        if (lastCode == null) {
            return "PRO001";
        }

        int number = Integer.parseInt(lastCode.substring(3));
        return String.format("PRO%03d", number + 1);
    }

}
