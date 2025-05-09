import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import getPrismaClient from '../../../database/prisma/prismaClient';
import { UpdateProductController } from './controller';
import { DbProductRepository } from '../../domain/database';
import { ProductService } from '../../domain/service';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = getPrismaClient();

  try {
    if (!event.pathParameters?.id || !event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Product ID and body are required' })
      };
    }

    const productId = event.pathParameters?.id;
    const requestData = JSON.parse(event.body);

    const productRepository = new DbProductRepository(prismaClient);
    const productService = new ProductService(productRepository);
    const productController = new UpdateProductController(productService);

    const result = await productController.handle({
      id: Number(productId),
      name: requestData.name,
      description: requestData.description,
      price: requestData.price,
      categoryId: requestData.categoryId
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Product updated successfully',
        data: result,
      }),
    };
  } catch (error: any) {
    logger.error('Error updating product', error);

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