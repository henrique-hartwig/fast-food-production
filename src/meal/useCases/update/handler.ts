import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DbMealRepository } from '../../domain/database';
import { MealService } from '../../domain/service';
import getPrismaClient from '../../../database/prisma/prismaClient';
import { UpdateMealController } from './controller';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = getPrismaClient();

  try {
    if (!event.pathParameters?.id || !event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Meal ID and body are required' })
      };
    }

    const mealId = event.pathParameters?.id;
    const requestData = JSON.parse(event.body);

    const mealRepository = new DbMealRepository(prismaClient);
    const mealService = new MealService(mealRepository);
    const mealController = new UpdateMealController(mealService);

    const result = await mealController.handle({
      id: Number(mealId),
      items: requestData.items
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Meal updated successfully',
        data: result,
      }),
    };
  } catch (error: any) {
    logger.error('Error updating meal', error);

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