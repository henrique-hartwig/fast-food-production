export interface OrderItem {
  id: number;
  quantity: number;
}

export interface Items {
  items: OrderItem[];
}

export enum OrderStatus {
  RECEIVED = 'received',
  IN_PREPARATION = 'in_preparation',
  READY = 'ready',
  FINISHED = 'finished',
}

export class Order {
  constructor(
    public id: number,
    public items: Items | null,
    public total: number,
    public status: OrderStatus,
    public userId?: number,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
