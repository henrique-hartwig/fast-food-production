import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DbProductCategoryRepository } from '../../domain/database';
import { ProductCategoryService } from '../../domain/service';
import getPrismaClient from '../../../database/prisma/prismaClient';
import { UpdateProductCategoryController } from './controller';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = getPrismaClient();

  try {
    if (!event.pathParameters?.id || !event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Product category ID and body are required' })
      };
    }

    const productCategoryId = event.pathParameters?.id;
    const requestData = JSON.parse(event.body);

    const productCategoryRepository = new DbProductCategoryRepository(prismaClient);
    const productCategoryService = new ProductCategoryService(productCategoryRepository);
    const productCategoryController = new UpdateProductCategoryController(productCategoryService);

    const result = await productCategoryController.handle({
      id: Number(productCategoryId),
      name: requestData.name,
      description: requestData.description
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Product category updated successfully',
        data: result,
      }),
    };
  } catch (error: any) {
    logger.error('Error updating product category', error);

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