import { OrdersHttp } from "../../../../utils/ConHttp";
import { OrderDTO } from "../dto/OrderDTO";

class OrderRepository {
  // Get all orders by date
  async getAllOrdersByDate(date) {
    const response = await OrdersHttp.get(`/findByDate`, { params: { date } });
    return response.data.map((order) => new OrderDTO(order).toDomain());
  }

  // Get order by ID
  async getOrderById(id) {
    const response = await OrdersHttp.get(`/order/${id}`);
    return new OrderDTO(response.data).toDomain();
  }

  // Create a new order
  async createOrder(order) {
    const orderDTO = OrderDTO.fromDomain(order);
    const response = await OrdersHttp.post(`/order/create`, orderDTO);
    return new OrderDTO(response.data).toDomain();
  }

  // Update an existing order
  async updateOrder(id, order) {
    const orderDTO = OrderDTO.fromDomain(order);
    const response = await OrdersHttp.put(`/order/update/${id}`, orderDTO);
    return new OrderDTO(response.data).toDomain();
  }

  // Delete an order by ID
  async deleteOrder(id) {
    await OrdersHttp.delete(`/order/delete/${id}`);
  }

  // Get orders by supplier ID
  async getOrdersBySupplier(supplierId) {
    const response = await OrdersHttp.get(`/findBySupplier`, { params: { supplierId } });
    return response.data.map((order) => new OrderDTO(order).toDomain());
  }

  // Get orders by status
  async getOrdersByStatus(status) {
    const response = await OrdersHttp.get(`/findByStatus`, { params: { status } });
    return response.data.map((order) => new OrderDTO(order).toDomain());
  }

  // Get orders by total range
  async getOrdersByTotalRange(min, max) {
    const response = await OrdersHttp.get(`/findByTotalRange`, { params: { min, max } });
    return response.data.map((order) => new OrderDTO(order).toDomain());
  }

  // Get order details by order ID
  async getOrderDetailsByOrderId(orderId) {
    const response = await OrdersHttp.get(`/order-details/findByOrderId/${orderId}`);
    return response.data;
  }

  // Update order details by ID
  async updateOrderDetails(orderDetailId, details) {
    const response = await OrdersHttp.put(`/order-details/update/${orderDetailId}`, details);
    return response.data;
  }

  // Delete order details by ID
  async deleteOrderDetails(orderDetailId) {
    await OrdersHttp.delete(`/order-details/delete/${orderDetailId}`);
  }
}

export default OrderRepository;
