import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import getPrismaClient from '../../../database/prisma/prismaClient';
import { GetProductController } from './controller';
import { DbProductRepository } from '../../domain/database';
import { ProductService } from '../../domain/service';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = getPrismaClient();

  try {
    if (!event.pathParameters?.id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const productId = event.pathParameters?.id;

    const productRepository = new DbProductRepository(prismaClient);
    const productService = new ProductService(productRepository);
    const productController = new GetProductController(productService);

    const result = await productController.handle({ id: Number(productId) });

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error) {
    logger.error('Error getting product', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 