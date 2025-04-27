import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OrderService } from '../../../domain/services/OrderService';
import { DbOrderRepository } from '../../../infrastructure/database/repositories/DbOrderRepository';
import { getPrismaClient } from '../../../infrastructure/database/prisma/prismaClient';
import { DeleteOrderController } from '../../http-controllers/order/deleteOrderController';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = getPrismaClient();

  try {
    if (!event.pathParameters?.id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Order ID is required' })
      };
    }

    const orderId = event.pathParameters?.id;

    const orderRepository = new DbOrderRepository(prismaClient);
    const orderService = new OrderService(orderRepository);
    const orderController = new DeleteOrderController(orderService);

    const result = await orderController.handle({ id: Number(orderId) });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error) {
    logger.error(`Error getting order`, error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 