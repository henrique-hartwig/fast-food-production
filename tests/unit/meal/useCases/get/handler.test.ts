import { handler } from '../../../../../src/meal/useCases/get/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Get Meal Lambda', () => {
  let mockMealGet: jest.Mock;

  beforeEach(() => {
    mockMealGet = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      meal: {
        findUnique: mockMealGet,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should return 200 if find the meal', async () => {
    const event = {
      pathParameters: {
        id: 123,
      },
    } as any;

    mockMealGet.mockResolvedValue({
      id: 123,
      items: [{ id: 1, quantity: 1 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data).toMatchObject({
      id: 123,
      items: [{ id: 1, quantity: 1 }],
    });
  });

  it('should return 400 if mealId is not sent', async () => {
    const event = {
      pathParameters: {
        id: null,
      },
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Meal ID is required');
    expect(mockMealGet).not.toHaveBeenCalled();
  });

  it('should return 400 if mealId is not a number', async () => {
    const event = {
      pathParameters: {
        id: 'invalid',
      },
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Validation error');
    expect(mockMealGet).not.toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      pathParameters: {
        id: 999,
      },
    } as any;

    mockMealGet.mockRejectedValue(new Error('Not found'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
    expect(mockMealGet).toHaveBeenCalledTimes(1);
    expect(mockMealGet).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
