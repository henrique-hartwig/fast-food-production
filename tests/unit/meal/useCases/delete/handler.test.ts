import { handler } from '../../../../../src/meal/useCases/delete/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Delete Meal Lambda', () => {
  let mockMealDelete: jest.Mock;

  beforeEach(() => {
    mockMealDelete = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      meal: {
        delete: mockMealDelete,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should return 200 if a valid meal is deleted', async () => {
    const event = {
      pathParameters: {
        id: 123,
      },
    } as any;

    mockMealDelete.mockResolvedValue(true);

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Meal deleted successfully');
    expect(body.data).toBeTruthy();
    expect(mockMealDelete).toHaveBeenCalledTimes(1);
    expect(mockMealDelete).toHaveBeenCalledWith({ where: { id: 123 } });
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
    expect(mockMealDelete).not.toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      pathParameters: {
        id: 999,
      },
    } as any;

    mockMealDelete.mockRejectedValue(new Error('Not found'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
    expect(mockMealDelete).toHaveBeenCalledTimes(1);
    expect(mockMealDelete).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
