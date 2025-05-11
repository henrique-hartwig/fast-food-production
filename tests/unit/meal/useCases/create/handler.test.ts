import { handler } from '../../../../../src/meal/useCases/create/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Create Meal Lambda', () => {
  let mockMealCreate: jest.Mock;

  beforeEach(() => {
    mockMealCreate = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      meal: {
        create: mockMealCreate,
      },
      $disconnect: jest.fn(),
    }));

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
});
