import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OrderService } from '../../../domain/services/OrderService';
import { DbOrderRepository } from '../../../infrastructure/database/repositories/DbOrderRepository';
import { getPrismaClient } from '../../../infrastructure/database/prisma/prismaClient';
import { CreateOrderController } from '../../http-controllers/order/createOrderController';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = getPrismaClient();

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const body = JSON.parse(event.body);
    const requestData = JSON.parse(body);

    const orderRepository = new DbOrderRepository(prismaClient);
    const orderService = new OrderService(orderRepository);
    const orderController = new CreateOrderController(orderService);

    const result = await orderController.handle(requestData);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error) {
    logger.error('Error creating order', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 