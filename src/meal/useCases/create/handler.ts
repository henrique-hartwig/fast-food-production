import { PrismaClient } from '@prisma/client';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DbMealRepository } from '../../domain/database';
import { MealService } from '../../domain/service';
import { CreateMealController } from './controller';
import logger from '../../../utils/logger';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const prismaClient = new PrismaClient();

  try {
    if (!event.body || Object.keys(event.body).length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const requestData = JSON.parse(event.body);

    const mealRepository = new DbMealRepository(prismaClient);
    const mealService = new MealService(mealRepository);
    const mealController = new CreateMealController(mealService);

    const result = await mealController.handle(requestData);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Meal created successfully',
        data: result
      })
    };

  } catch (error: any) {
    logger.error('Error creating meal', error);

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