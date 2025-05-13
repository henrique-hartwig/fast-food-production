import { PrismaClient } from '@prisma/client';
import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { DbMealRepository } from '../../domain/database';
import { MealService } from '../../domain/service';
import { CreateMealController, CreateMealRequest } from './controller';
import logger from '../../../utils/logger';

interface OrderResponse {
  data: {
    items: {
      items: CreateMealRequest[];
    }
  }
}

export const handler = async (event: SQSEvent | APIGatewayProxyEvent): Promise<any> => {
  const prismaClient = new PrismaClient();

  try {
    if ('Records' in event && event.Records) {
      return await processSQSEvent(event, prismaClient);
    } 

    return await processAPIGatewayEvent(event as APIGatewayProxyEvent, prismaClient);
  } catch (error: any) {
    logger.error('Error processing payment event', error);
    throw error;
  }
};

async function processSQSEvent(event: SQSEvent, prismaClient: PrismaClient): Promise<void> {
  const mealRepository = new DbMealRepository(prismaClient);
  const mealService = new MealService(mealRepository);
  const mealController = new CreateMealController(mealService);

  for (const record of event.Records) {
    try {
      const requestData = JSON.parse(record.body);
      const orderId = requestData.orderId;
    
      const orderResponse = await fetch(`${process.env.ORDERS_API_URL}/order/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      const orderData = await orderResponse.json() as OrderResponse;
    
      logger.info(`Processing meal from queue: ${JSON.stringify(orderData.data.items)}`);

      await mealController.handle(orderData.data.items.items as unknown as CreateMealRequest);

      const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

      await sqsClient.send(new DeleteMessageCommand({
        QueueUrl: process.env.PAYMENTS_QUEUE_URL!,
        ReceiptHandle: record.receiptHandle
      }));

      logger.info(`Message ${record.messageId} successfully processed and deleted from queue`);
    } catch (error) {
      logger.error(`Error processing SQS message: ${record.messageId}`, error);
    }
  }
}

export const processAPIGatewayEvent = async (event: APIGatewayProxyEvent, prismaClient: PrismaClient): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body || Object.keys(event.body).length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const requestData = JSON.parse(event.body);
    const orderId = requestData.orderId;

    const orderResponse = await fetch(`${process.env.ORDERS_API_URL}/order/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const orderData = await orderResponse.json() as OrderResponse;
    const mealRepository = new DbMealRepository(prismaClient);
    const mealService = new MealService(mealRepository);
    const mealController = new CreateMealController(mealService);

    const result = await mealController.handle(orderData.data.items as unknown as CreateMealRequest);

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