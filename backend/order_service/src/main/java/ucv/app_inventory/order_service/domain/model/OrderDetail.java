package ucv.app_inventory.order_service.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

/**
 * Represents the details of an order, including the product ID, quantity, and unit price.
 * This entity is used to store each item in an order, allowing for the calculation of
 * individual totals per item.
 */
@Entity
@Table(name = "order_details")
@Data
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    @Column(name = "product_supplier_id", nullable = false)
    private Long productSupplierId;

    @Column(name = "quantity", nullable = false)
    private Long quantity;

    @Override
    public String toString() {
        return "OrderDetail{" +
                "id=" + id +
                ", productSupplierId=" + productSupplierId +
                ", quantity=" + quantity +
                ", orderId=" + order.getId() +
                '}';
    }


}