package ucv.app_inventory.proveedores.domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

    // Métodos de búsqueda por cada criterio y combinaciones de ellos
    List<Proveedor> findByNombre(String nombre);

    List<Proveedor> findByContacto(String contacto);

    List<Proveedor> findByIdcategoria(Long idcategoria);

    List<Proveedor> findByNombreAndContacto(String nombre, String contacto);

    List<Proveedor> findByNombreAndIdcategoria(String nombre, Long idcategoria);

    List<Proveedor> findByContactoAndIdcategoria(String contacto, Long idcategoria);

    List<Proveedor> findByNombreAndContactoAndIdcategoria(String nombre, String contacto, Long idcategoria);
}
