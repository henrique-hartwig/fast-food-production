import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OrderService } from '../../domain/service';
import { DbOrderRepository } from '../../domain/database';
import { getPrismaClient } from '../../../database/prisma/prismaClient';
import { UpdateOrderController } from './controller';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = getPrismaClient();

  try {
    if (!event.pathParameters?.id || !event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Order ID and items are required' })
      };
    }

    const orderId = event.pathParameters?.id;
    const body = JSON.parse(event.body);
    const requestData = JSON.parse(body);

    const orderRepository = new DbOrderRepository(prismaClient);
    const orderService = new OrderService(orderRepository);
    const orderController = new UpdateOrderController(orderService);

    const result = await orderController.handle({
      id: Number(orderId),
      items: requestData.items,
      total: requestData.total,
      userId: requestData.userId
    });

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