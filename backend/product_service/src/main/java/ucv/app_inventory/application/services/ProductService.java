package ucv.app_inventory.application.services;

import ucv.app_inventory.domain.entities.Product;

import java.util.List;

public interface ProductService {

    List<Product> listProducts();

    Product saveProduct(final Product product);

    void deleteProduct(final Integer id);

    Product findProductById(final Integer id);
}
