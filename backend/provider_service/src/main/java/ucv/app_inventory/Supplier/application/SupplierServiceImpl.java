package ucv.app_inventory.Supplier.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ucv.app_inventory.Supplier.domain.Supplier;
import ucv.app_inventory.Supplier.domain.SupplierRepository;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Override
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }

    @Override
    public Supplier updateSupplier(Long id, Supplier updatedSupplier) {
        return supplierRepository.findById(id).map(supplier -> {
            supplier.setName(updatedSupplier.getName());
            supplier.setContact(updatedSupplier.getContact());
            supplier.setPhone(updatedSupplier.getPhone());
            supplier.setEmail(updatedSupplier.getEmail());
            supplier.setAddress(updatedSupplier.getAddress());
            supplier.setConditions(updatedSupplier.getConditions());
            supplier.setCategoryId(updatedSupplier.getCategoryId());
            return supplierRepository.save(supplier);
        }).orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    @Override
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }

    @Override
    public Supplier searchSupplierById(Long supplierId) {
        return supplierRepository.findBySupplierId(supplierId);
    }
}
