import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DbMealRepository } from '../../domain/database';
import { MealService } from '../../domain/service';
import getPrismaClient from '../../../database/prisma/prismaClient';
import { ListMealsController } from './controller';
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

    const mealRepository = new DbMealRepository(prismaClient);
    const mealService = new MealService(mealRepository);
    const mealController = new ListMealsController(mealService);

    const result = await mealController.handle(requestData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error: any) {
    logger.error('Error listing meals', error);

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