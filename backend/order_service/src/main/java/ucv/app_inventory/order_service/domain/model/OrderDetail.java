package ucv.app_inventory.order_service.domain.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "detalle_pedidos")
@Data
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Almacenar el ID del producto, lo que permite obtener información del producto de otro microservicio
    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false)
    private Double precioUnitario;

    // Este campo te permite calcular el total por cada detalle del pedido
    public Double calcularTotal() {
        return this.cantidad * this.precioUnitario;
    }
}
