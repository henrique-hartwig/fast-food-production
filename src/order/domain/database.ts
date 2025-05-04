import { PrismaClient } from '@prisma/client';
import { Order, OrderStatus, Items } from './entity';
import { OrderRepository } from './repository';

function parseItems(items: any): Items | null {
  if (!items) return null;
  if (typeof items === 'string') {
    try {
      return JSON.parse(items);
    } catch {
      return null;
    }
  }
  return items as Items;
}

export class DbOrderRepository implements OrderRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(order: Order): Promise<Order> {
    const orderData = await this.prisma.order.create({
      data: {
        items: order.items ? JSON.parse(JSON.stringify(order.items)) : { items: [] },
        total: order.total,
        status: order.status,
        userId: order.userId ?? undefined,
      },
    });

    return new Order(
      orderData.id,
      parseItems(orderData.items),
      orderData.total,
      orderData.status as OrderStatus,
      orderData.userId ?? undefined,
    );
  }

  async findById(id: number): Promise<Order | null> {
    const orderData = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!orderData) {
      return null;
    }

    return new Order(
      orderData.id,
      parseItems(orderData.items),
      orderData.total,
      orderData.status as OrderStatus,
      orderData.userId ?? undefined,
    );
  }

  async update(order: Order): Promise<Order> {
    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        items: order.items ? JSON.parse(JSON.stringify(order.items)) : { items: [] },
        total: order.total,
        status: order.status,
        userId: order.userId ?? undefined,
      },
    });

    return new Order(
      updatedOrder.id,
      parseItems(updatedOrder.items),
      updatedOrder.total,
      updatedOrder.status as OrderStatus,
      updatedOrder.userId ?? undefined,
    );
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.order.delete({
      where: { id },
    });
    return true;
  }

  async list(limit: number, offset: number): Promise<Order[]> {
    const ordersData = await this.prisma.order.findMany({
      skip: offset,
      take: limit,
    });
    return ordersData.map((orderData: Order) =>
      new Order(
        orderData.id,
        parseItems(orderData.items),
        orderData.total,
        orderData.status as OrderStatus,
        orderData.userId ?? undefined,
      ),
    );
  }
}

