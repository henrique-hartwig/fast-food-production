import { Order } from './entity';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: number): Promise<Order | null>;
  update(order: Order): Promise<Order>;
  delete(id: number): Promise<boolean>;
  list(limit: number, offset: number): Promise<Order[]>;
}
