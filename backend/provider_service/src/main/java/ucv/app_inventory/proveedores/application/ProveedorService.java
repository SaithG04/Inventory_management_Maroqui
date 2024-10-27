package ucv.app_inventory.proveedores.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ucv.app_inventory.proveedores.domain.Proveedor;
import ucv.app_inventory.proveedores.domain.ProveedorRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    public Proveedor agregarProveedor(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    public List<Proveedor> obtenerTodosLosProveedores() {
        return proveedorRepository.findAll();
    }

    public Optional<Proveedor> obtenerProveedorPorId(Long id) {
        return proveedorRepository.findById(id);
    }

    public Proveedor actualizarProveedor(Long id, Proveedor proveedorActualizado) {
        return proveedorRepository.findById(id).map(proveedor -> {
            proveedor.setNombre(proveedorActualizado.getNombre());
            proveedor.setContacto(proveedorActualizado.getContacto());
            proveedor.setTelefono(proveedorActualizado.getTelefono());
            proveedor.setCorreo(proveedorActualizado.getCorreo());
            proveedor.setDireccion(proveedorActualizado.getDireccion());
            proveedor.setCondiciones(proveedorActualizado.getCondiciones());
            proveedor.setIdcategoria(proveedorActualizado.getIdcategoria());
            return proveedorRepository.save(proveedor);
        }).orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }

    public void eliminarProveedor(Long id) {
        proveedorRepository.deleteById(id);
    }

    public List<Proveedor> buscarProveedores(String nombre, String contacto, Long idcategoria) {
        if (nombre != null && contacto != null && idcategoria != null) {
            return proveedorRepository.findByNombreAndContactoAndIdcategoria(nombre, contacto, idcategoria);
        } else if (nombre != null && contacto != null) {
            return proveedorRepository.findByNombreAndContacto(nombre, contacto);
        } else if (nombre != null && idcategoria != null) {
            return proveedorRepository.findByNombreAndIdcategoria(nombre, idcategoria);
        } else if (contacto != null && idcategoria != null) {
            return proveedorRepository.findByContactoAndIdcategoria(contacto, idcategoria);
        } else if (nombre != null) {
            return proveedorRepository.findByNombre(nombre);
        } else if (contacto != null) {
            return proveedorRepository.findByContacto(contacto);
        } else if (idcategoria != null) {
            return proveedorRepository.findByIdcategoria(idcategoria);
        } else {
            return proveedorRepository.findAll();
        }
    }
}
