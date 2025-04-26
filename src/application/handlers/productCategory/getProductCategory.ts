import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DbProductCategoryRepository } from '../../../infrastructure/database/repositories/DbProductCategory';
import { ProductCategoryService } from '../../../domain/services/ProductCategoryService';
import { getPrismaClient } from '../../../infrastructure/database/prisma/prismaClient';
import { GetProductCategoryController } from '../../http-controllers/productCategory/getProductCategoryController';
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

    const productCategoryId = event.pathParameters?.id;

    const productCategoryRepository = new DbProductCategoryRepository(prismaClient);
    const productCategoryService = new ProductCategoryService(productCategoryRepository);
    const productCategoryController = new GetProductCategoryController(productCategoryService);

    const result = await productCategoryController.handle({ id: Number(productCategoryId) });

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error) {
    logger.error('Error getting product category', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 