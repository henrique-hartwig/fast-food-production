import { handler } from '../../../../../src/meal/useCases/list/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('List Meal Lambda', () => {
  let mockMealList: jest.Mock;

  beforeEach(() => {
    mockMealList = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      meal: {
        findMany: mockMealList,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should return 200 and use limit and offset when sent', async () => {
    const event = {
      queryStringParameters: {
        limit: '10',
        offset: '5',
      },
    } as any;

    mockMealList.mockResolvedValue([{
      id: 123,
      items: [{ id: 1, quantity: 2 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(mockMealList).toHaveBeenCalledWith({
      take: 10,
      skip: 5,
    });
  });

  it('should fail when limit is not sent', async () => {
    const event = {
      queryStringParameters: {
        offset: '5',
      },
    } as any;

    mockMealList.mockResolvedValue([{
      id: 123,
      items: [{ id: 1, quantity: 2 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toContain('Query parameters are required');
  });

  it('should fail when offset is not sent', async () => {
    const event = {
      queryStringParameters: {
        limit: '10',
      },
    } as any;

    mockMealList.mockResolvedValue([{
      id: 123,
      items: [{ id: 1, quantity: 2 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toContain('Query parameters are required');
  });

  it('should fail when limit and offset are not sent', async () => {
    const event = {
      queryStringParameters: undefined,
    } as any;

    mockMealList.mockResolvedValue([{
      id: 123,
      items: [{ id: 1, quantity: 2 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toContain('Query parameters are required');
  });

  it('should return 500 when an unexpected error occurs', async () => {
    const event = {
      queryStringParameters: {
        limit: '10',
        offset: '0',
      },
    } as any;

    mockMealList.mockRejectedValue(new Error('Unexpected error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Internal server error'
    });
  });
});
