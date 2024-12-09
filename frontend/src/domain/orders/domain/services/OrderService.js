import OrderRepository from "../../infrastructure/repositories/OrderRepository";

class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async getAllOrdersByDate(date) {
    return await this.orderRepository.getAllOrdersByDate(date);
  }

  async getOrderById(id) {
    return await this.orderRepository.getOrderById(id);
  }

  async createOrder(order) {
    return await this.orderRepository.createOrder(order);
  }

  async updateOrder(id, order) {
    return await this.orderRepository.updateOrder(id, order);
  }

  async deleteOrder(id) {
    return await this.orderRepository.deleteOrder(id);
  }

  async getOrdersBySupplier(supplierId) {
    return await this.orderRepository.getOrdersBySupplier(supplierId);
  }

  async getOrdersByStatus(status) {
    return await this.orderRepository.getOrdersByStatus(status);
  }

  async getOrdersByTotalRange(min, max) {
    return await this.orderRepository.getOrdersByTotalRange(min, max);
  }

  async getOrderDetailsByOrderId(orderId) {
    return await this.orderRepository.getOrderDetailsByOrderId(orderId);
  }

  async updateOrderDetails(orderDetailId, details) {
    return await this.orderRepository.updateOrderDetails(orderDetailId, details);
  }

  async deleteOrderDetails(orderDetailId) {
    return await this.orderRepository.deleteOrderDetails(orderDetailId);
  }
}

export default OrderService;
