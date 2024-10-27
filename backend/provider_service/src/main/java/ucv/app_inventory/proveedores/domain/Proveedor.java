package ucv.app_inventory.proveedores.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProveedor;
    private Long Idcategoria;
    private String nombre;
    private String contacto;
    private String telefono;
    private String correo;
    private String direccion;

    private String condiciones;


}