import { handler } from '../../../../../src/order/useCases/delete/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Delete Order Lambda', () => {
  let mockOrderDelete: jest.Mock;

  beforeEach(() => {
    mockOrderDelete = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      order: {
        delete: mockOrderDelete,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should return 200 if a valid order is deleted', async () => {
    const event = {
      pathParameters: {
        id: 123,
      },
    } as any;

    mockOrderDelete.mockResolvedValue(true);

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Order deleted successfully');
    expect(body.data).toBeTruthy();
    expect(mockOrderDelete).toHaveBeenCalledTimes(1);
    expect(mockOrderDelete).toHaveBeenCalledWith({ where: { id: 123 } });
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
    expect(mockOrderDelete).not.toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      pathParameters: {
        id: 999,
      },
    } as any;

    mockOrderDelete.mockRejectedValue(new Error('Not found'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
    expect(mockOrderDelete).toHaveBeenCalledTimes(1);
    expect(mockOrderDelete).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
