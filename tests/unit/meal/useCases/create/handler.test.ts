import { SQSEvent } from 'aws-lambda';
import { handler } from '../../../../../src/meal/useCases/create/handler';
import { PrismaClient } from '@prisma/client';

jest.mock('node-fetch', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        items: [
          {
            id: 1,
            quantity: 2
          }
        ]
      })
    });
  });
});

jest.mock('@aws-sdk/client-sqs', () => {
  return {
    SQSClient: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({})
    })),
    DeleteMessageCommand: jest.fn().mockImplementation((input) => input)
  };
});

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Create Meal Lambda', () => {
  let mockMealCreate: jest.Mock;
  let mockSQSDelete: jest.Mock;

  beforeEach(() => {
    mockMealCreate = jest.fn();
    mockSQSDelete = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      meal: {
        create: mockMealCreate,
      },
      $disconnect: jest.fn(),
    }));

    (require('@aws-sdk/client-sqs').SQSClient as jest.Mock)
      .mockImplementation(() => ({
        send: mockSQSDelete,
    }));
    process.env.PAYMENTS_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';

    jest.clearAllMocks();
  });

  it('should return 400 if no body is sent', async () => {
    const event = { body: null } as any;
    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Request body is required');
    expect(mockMealCreate).not.toHaveBeenCalled();
  });

  it('should return 201 if a valid meal is created', async () => {
    const event = {
      body: JSON.stringify({
        items: [{ id: 1, quantity: 1 }],
      }),
    } as any;

    const fakeMeal = {
      id: 123,
      items: [{ id: 1, quantity: 1 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockMealCreate.mockResolvedValue(fakeMeal);
    mockSQSDelete.mockResolvedValue({});

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Meal created successfully');
    expect(body.data).toMatchObject({
      id: 123,
      items: [{ id: 1, quantity: 1 }],
    });
    expect(mockMealCreate).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if validation error occurs', async () => {
    const event = {
      body: JSON.stringify({
        items: [{ quantity: 1 }],
      }),
    } as any;

    const zodError = new Error('Validation error');
    zodError.name = 'ZodError';
    (zodError as any).errors = [{ path: ['items'], message: 'Invalid items' }];

    mockMealCreate.mockImplementation(() => { throw zodError; });

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Validation error');
    expect(body.details).toBeDefined();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      body: JSON.stringify({
        items: [{ id: 1, quantity: 1 }],
      }),
    } as any;

    mockMealCreate.mockRejectedValue(new Error('DB error'));

    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal server error');
    expect(mockMealCreate).toHaveBeenCalledTimes(1);
  });


  it('should process SQS event and create meal successfully', async () => {
    const event = {
      Records: [
        {
          messageId: 'test-message-id',
          body: JSON.stringify({
            items: [{ id: 1, quantity: 1 }],
          }),
          receiptHandle: 'test-receipt-handle',
        }
      ]
    } as SQSEvent;

    const fakeMeal = {
      id: 123,
      items: [{ id: 1, quantity: 1 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockMealCreate.mockResolvedValue(fakeMeal);
    mockSQSDelete.mockResolvedValue({});

    await handler(event);
  });
});
