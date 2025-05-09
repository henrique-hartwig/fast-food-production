import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OrderService } from '../../domain/service';
import { DbOrderRepository } from '../../domain/database';
import getPrismaClient from '../../../database/prisma/prismaClient';
import { ListOrdersController } from './controller';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = getPrismaClient();

  try {
    if (!event.queryStringParameters?.limit || !event.queryStringParameters?.offset) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Query parameters are required' })
      };
    }

    const requestData = {
      limit: parseInt(event.queryStringParameters?.limit),
      offset: parseInt(event.queryStringParameters?.offset)
    };

    const orderRepository = new DbOrderRepository(prismaClient);
    const orderService = new OrderService(orderRepository);
    const orderController = new ListOrdersController(orderService);

    const result = await orderController.handle(requestData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error: any) {
    logger.error(`Error getting order`, error);

    if (error?.name === 'ZodError') {
      console.log('error', error)
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Validation error',
          details: error.errors,
        }),
      };
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 