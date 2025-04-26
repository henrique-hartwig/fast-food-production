import { Order, OrderItem, OrderStatus } from '../entities/Order';
import { OrderRepository } from '../repositories/OrderRepository';

export class OrderService {
  constructor(private order: OrderRepository) {}

  async createOrder(items: OrderItem[], total: number, userId?: number): Promise<Order> {
    const order = new Order(Date.now(), items, total, OrderStatus.RECEIVED, userId);
    return this.order.create(order);
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.order.findById(id);
  }

  async updateOrder(id: number, items: OrderItem[], total: number, userId?: number): Promise<Order> {
    const order = new Order(id, items, total, OrderStatus.RECEIVED, userId);
    return this.order.update(order);
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    return this.order.update(order);
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.order.delete(id);
  }

  async listOrders(limit: number, offset: number): Promise<Order[]> {
    return this.order.list(limit, offset);
  }
}
