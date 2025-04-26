import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DbProductCategoryRepository } from '../../../infrastructure/database/repositories/DbProductCategory';
import { ProductCategoryService } from '../../../domain/services/ProductCategoryService';
import { getPrismaClient } from '../../../infrastructure/database/prisma/prismaClient';
import { UpdateProductCategoryController } from '../../http-controllers/productCategory/updateProductCategoryController';
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

    const productCategoryRepository = new DbProductCategoryRepository(prismaClient);
    const productCategoryService = new ProductCategoryService(productCategoryRepository);
    const productCategoryController = new UpdateProductCategoryController(productCategoryService);

    const result = await productCategoryController.handle(requestData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error) {
    logger.error('Error updating product category', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}; 