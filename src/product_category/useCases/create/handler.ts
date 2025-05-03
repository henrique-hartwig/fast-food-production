import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DbProductCategoryRepository } from '../../domain/database';
import { ProductCategoryService } from '../../domain/service';
import { PrismaClient } from '@prisma/client';
import { CreateProductCategoryController } from './controller';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = new PrismaClient();

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

    const productCategoryRepository = new DbProductCategoryRepository(prismaClient);
    const productCategoryService = new ProductCategoryService(productCategoryRepository);
    const productCategoryController = new CreateProductCategoryController(productCategoryService);

    const result = await productCategoryController.handle(requestData);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };

  } catch (error) {
    logger.error('Error creating product category', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 