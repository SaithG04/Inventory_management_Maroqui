package ucv.app_inventory.Supplier.application;

import ucv.app_inventory.Supplier.domain.Supplier;

import java.util.List;
import java.util.Optional;

public interface SupplierService {

    Supplier addSupplier(Supplier supplier);

    List<Supplier> getAllSuppliers();

    Optional<Supplier> getSupplierById(Long id);

    Supplier updateSupplier(Long id, Supplier updatedSupplier);

    void deleteSupplier(Long id);

    Supplier searchSupplierById(Long supplierId);
}
