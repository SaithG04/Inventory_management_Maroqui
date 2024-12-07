package ucv.app_inventory.supplier_service.infrastructure.outbound.database;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ucv.app_inventory.supplier_service.domain.model.Supplier;
import ucv.app_inventory.supplier_service.domain.model.SupplierState;

@Repository
public interface SupplierMySqlRepository extends JpaRepository<Supplier, Long> {


    /**
     * Finds orders by state.
     *
     * @param state   the current state of the supplier.
     * @param pageable pagination information.
     * @return a page of orders matching the specified state.
     */
    Page<Supplier> findByState(SupplierState state, Pageable pageable);

    Page<Supplier> findByNameStartingWith(String name, Pageable pageable);


}