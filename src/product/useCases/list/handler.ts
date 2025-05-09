import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import getPrismaClient from '../../../database/prisma/prismaClient';
import { ListProductsController } from './controller';
import { ProductService } from '../../domain/service';
import { DbProductRepository } from '../../domain/database';
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

    const productsRepository = new DbProductRepository(prismaClient);
    const productService = new ProductService(productsRepository);
    const productController = new ListProductsController(productService);

    const result = await productController.handle(requestData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error: any) {
    logger.error('Error listing products', error);

    if (error?.name === 'ZodError') {
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