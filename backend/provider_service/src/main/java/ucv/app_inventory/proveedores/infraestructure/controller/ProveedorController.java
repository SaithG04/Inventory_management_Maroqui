package ucv.app_inventory.proveedores.infraestructure.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucv.app_inventory.proveedores.application.ProveedorService;
import ucv.app_inventory.proveedores.domain.Proveedor;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    // Agregar proveedor
    @PostMapping
    public ResponseEntity<Proveedor> agregarProveedor(@RequestBody Proveedor proveedor) {
        Proveedor nuevoProveedor = proveedorService.agregarProveedor(proveedor);
        return ResponseEntity.ok(nuevoProveedor);
    }

    // Obtener todos los proveedores
    @GetMapping
    public ResponseEntity<List<Proveedor>> obtenerTodosLosProveedores() {
        return ResponseEntity.ok(proveedorService.obtenerTodosLosProveedores());
    }

    // Obtener proveedor por ID
    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> obtenerProveedorPorId(@PathVariable Long id) {
        Optional<Proveedor> proveedor = proveedorService.obtenerProveedorPorId(id);
        return proveedor.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Actualizar proveedor
    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> actualizarProveedor(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        Proveedor proveedorActualizado = proveedorService.actualizarProveedor(id, proveedor);
        return ResponseEntity.ok(proveedorActualizado);
    }

    // Eliminar proveedor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProveedor(@PathVariable Long id) {
        proveedorService.eliminarProveedor(id);
        return ResponseEntity.noContent().build();
    }

    // Buscar proveedores por nombre, contacto o idcategoria
    @GetMapping("/buscar")
    public ResponseEntity<List<Proveedor>> buscarProveedores(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String contacto,
            @RequestParam(required = false) Long idcategoria) {
        List<Proveedor> proveedores = proveedorService.buscarProveedores(nombre, contacto, idcategoria);
        return ResponseEntity.ok(proveedores);
    }
}
