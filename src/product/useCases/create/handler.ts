import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPrismaClient } from '../../../database/prisma/prismaClient';
import { CreateProductController } from './controller';
import { DbProductRepository } from '../../domain/database';
import { ProductService } from '../../domain/service';
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

    const productRepository = new DbProductRepository(prismaClient);
    const productService = new ProductService(productRepository);
    const productController = new CreateProductController(productService);

    const result = await productController.handle(requestData);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };

  } catch (error) {
    logger.error('Error creating product', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 