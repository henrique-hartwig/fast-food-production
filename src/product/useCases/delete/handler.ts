import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import getPrismaClient from '../../../database/prisma/prismaClient';
import { DeleteProductController } from './controller';
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
        body: JSON.stringify({ message: 'Product ID is required' })
      };
    }

    const productId = event.pathParameters?.id;

    const productRepository = new DbProductRepository(prismaClient);
    const productService = new ProductService(productRepository);
    const productController = new DeleteProductController(productService);

    const result = await productController.handle({ id: Number(productId) });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Product deleted successfully',
        data: result,
      }),
    };
  } catch (error: any) {

    logger.error('Error deleting product', error);

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
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}; 