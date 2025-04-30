import { PrismaClient } from '@prisma/client';
import { Order } from './entity';
import { OrderRepository } from './repository';
import { getPrismaClient } from '../../database/prisma/prismaClient';

export class DbOrderRepository implements OrderRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma || getPrismaClient();
  }

  async create(order: Order): Promise<Order> {
    const orderData = await this.prisma.order.create({
      data: {
        items: order.items,
        total: order.total,
        status: order.status,
        userId: order.userId,
      },
    });

    return new Order(
      orderData.id,
      orderData.items,
      orderData.total,
      orderData.status,
      orderData.userId,
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
      orderData.items,
      orderData.total,
      orderData.status,
      orderData.userId,
    );
  }

  async update(order: Order): Promise<Order> {
    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: { status: order.status },
    });
    return updatedOrder;
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
    return ordersData.map((order: Order) =>
      new Order(
        order.id,
        order.items,
        order.total,
        order.status,
        order.userId,
      ),
    );
  }
}

