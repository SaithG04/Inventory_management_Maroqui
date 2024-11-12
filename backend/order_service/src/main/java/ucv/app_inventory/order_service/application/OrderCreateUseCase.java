package ucv.app_inventory.order_service.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucv.app_inventory.order_service.application.dto.OrderDTO;
import ucv.app_inventory.order_service.application.dto.OrderDetailDTO;
import ucv.app_inventory.order_service.domain.model.Order;
import ucv.app_inventory.order_service.domain.model.OrderDetail;
import ucv.app_inventory.order_service.domain.model.OrderState;
import ucv.app_inventory.order_service.exception.TotalCannotBeNullException;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderDetailMySqlRepository;
import ucv.app_inventory.order_service.infrastructure.outbound.database.OrderMySqlRepository;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class OrderCreateUseCase {

    private final OrderMySqlRepository orderMySqlRepository;
    private final OrderDetailMySqlRepository orderDetailMySqlRepository;

    @Transactional
    public Order createOrder(OrderDTO orderDTO) {
        // Crear la entidad Order
        Order order = new Order();
        order.setSupplierId(orderDTO.getSupplierId());
        order.setStatus(OrderState.valueOf(orderDTO.getStatus()));
        order.setObservations(orderDTO.getObservations());
        order.setOrderDate(LocalDate.parse(orderDTO.getOrderDate()));

        // Primero, guarda la orden sin el total para generar el ID
        order.setTotal(0.0);
        order = orderMySqlRepository.save(order); // Guarda la orden inicial con el total en 0.0

        // Calcula el total y guarda los detalles de la orden utilizando el método reutilizable
        double total = processOrderDetails(orderDTO, order, orderDetailMySqlRepository);

        // Actualiza el total de la orden
        order.setTotal(total);

        // Guarda la orden con el total actualizado
        order = orderMySqlRepository.save(order);

        // Verificar que el total no sea 0
        if (order.getTotal() == 0.0) {
            throw new TotalCannotBeNullException("El total no puede ser cero.");
        }

        return order;
    }

    public static double processOrderDetails(OrderDTO orderDTO, Order order,
                                             OrderDetailMySqlRepository orderDetailMySqlRepository) {
        double total = 0.0;

        for (OrderDetailDTO detailDTO : orderDTO.getOrderDetails()) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order); // Asocia el detalle con la orden
            orderDetail.setProductId(detailDTO.getProductId());
            orderDetail.setQuantity(detailDTO.getQuantity());
            orderDetail.setUnitPrice(detailDTO.getUnitPrice());

            // Calcula el total por cada detalle
            total += orderDetail.calculateTotal();

            // Guarda el detalle de la orden
            orderDetailMySqlRepository.save(orderDetail);
        }

        return total;
    }

}
