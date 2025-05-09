import { handler } from '../../../../../src/order/useCases/list/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('List Order Lambda', () => {
  let mockOrderList: jest.Mock;

  beforeEach(() => {
    mockOrderList = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      order: {
        findMany: mockOrderList,
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

    mockOrderList.mockResolvedValue([{
      id: 123,
      status: 'received',
      userId: 1,
      items: [{ id: 1, quantity: 2 }],
      total: 50.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(mockOrderList).toHaveBeenCalledWith({
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

    mockOrderList.mockResolvedValue([{
      id: 123,
      status: 'received',
      userId: 1,
      items: [{ id: 1, quantity: 2 }],
      total: 50.0,
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

    mockOrderList.mockResolvedValue([{
      id: 123,
      status: 'received',
      userId: 1,
      items: [{ id: 1, quantity: 2 }],
      total: 50.0,
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

    mockOrderList.mockResolvedValue([{
      id: 123,
      status: 'received',
      userId: 1,
      items: [{ id: 1, quantity: 2 }],
      total: 50.0,
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

    mockOrderList.mockRejectedValue(new Error('Unexpected error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Internal server error'
    });
  });
});
