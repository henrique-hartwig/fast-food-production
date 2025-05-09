import { handler } from '../../../../../src/order/useCases/get/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Get Order Lambda', () => {
  let mockOrderGet: jest.Mock;

  beforeEach(() => {
    mockOrderGet = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      order: {
        findUnique: mockOrderGet,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should return 200 if find the order', async () => {
    const event = {
      pathParameters: {
        id: 123,
      },
    } as any;

    mockOrderGet.mockResolvedValue({
      id: 123,
      status: 'received',
      userId: 1,
      items: [{ id: 1, quantity: 2 }],
      total: 50.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data).toMatchObject({
      id: 123,
      status: 'received',
      userId: 1,
      items: [{ id: 1, quantity: 2 }],
      total: 50.0
    });
    expect(mockOrderGet).toHaveBeenCalledTimes(1);
    expect(mockOrderGet).toHaveBeenCalledWith({ where: { id: 123 } });
  });

  it('should return 400 if orderId is not sent', async () => {
    const event = {
      pathParameters: {
        id: null,
      },
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Order ID is required');
    expect(mockOrderGet).not.toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      pathParameters: {
        id: 999,
      },
    } as any;

    mockOrderGet.mockRejectedValue(new Error('Not found'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
    expect(mockOrderGet).toHaveBeenCalledTimes(1);
    expect(mockOrderGet).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
