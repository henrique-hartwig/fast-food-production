import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DbMealRepository } from '../../domain/database';
import { MealService } from '../../domain/service';
import getPrismaClient from '../../../database/prisma/prismaClient';
import { DeleteMealController } from './controller';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = getPrismaClient();

  try {
    if (!event.pathParameters?.id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Meal ID is required' })
      };
    } 

    const mealId = event.pathParameters?.id;

    const mealRepository = new DbMealRepository(prismaClient);
    const mealService = new MealService(mealRepository);
    const mealController = new DeleteMealController(mealService);

    const result = await mealController.handle({ id: Number(mealId) });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Meal deleted successfully',
        data: result,
      }),
    };
  } catch (error: any) {
    logger.error('Error deleting meal', error);

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