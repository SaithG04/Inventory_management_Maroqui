package ucv.app_inventory.application.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ucv.app_inventory.adapters.outbounds.SupplierClient;
import ucv.app_inventory.adapters.repositories.ProductRepository;
import ucv.app_inventory.adapters.repositories.ProductSupplierRepository;
import ucv.app_inventory.application.DTO.SupplierDTO;
import ucv.app_inventory.domain.entities.Product;
import ucv.app_inventory.domain.entities.ProductSupplier;
import ucv.app_inventory.exception.InvalidFieldException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProductServiceImpl implements ProductService{
    private final ProductRepository productRepository;
    private final SupplierClient supplierClient;
    private final ProductSupplierRepository productSupplierRepository;


    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, SupplierClient supplierClient, ProductSupplierRepository productSupplierRepository) {
        this.productRepository = productRepository;
        this.supplierClient = supplierClient;
        this.productSupplierRepository = productSupplierRepository;
    }



    @Override
    public Page<Product> listProducts(int page, int size) {
        return productRepository.findAll(PageRequest.of(page, size));
    }

    @Override
    public Product createProduct(Product product) {
        if (product.getCode() == null || product.getCode().isEmpty()) {
            product.setCode(getNextProductCode());
        }
        if (product.getStock() == null) {
            product.setStock(0);
        }
        if (product.getSalePrice() == null){
            product.setSalePrice(0.0);
        }
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Product product) {
        if (product.getCode() == null || product.getCode().isEmpty()) {
            product.setCode(getNextProductCode());
        }
        if (product.getStock() == null) {
            product.setStock(0);
        }
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Product product) {
        Long id = product.getId();
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
        List<ProductSupplier> productSuppliers = productSupplierRepository.findByProductId(productId);
        if(productSuppliers==null|| productSuppliers.isEmpty()){
            throw new InvalidFieldException("Not found suppliers for product with ID: "+ productId);
        }
        List<SupplierDTO>supplierDTOList=new ArrayList<>();
        productSuppliers.forEach(productSupplier -> {
            Long supplierId = productSupplier.getSupplierId();
            SupplierDTO supplierDTO = supplierClient.getSupplierById(supplierId);
            supplierDTOList.add(supplierDTO);
        });
        return supplierDTOList;
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
