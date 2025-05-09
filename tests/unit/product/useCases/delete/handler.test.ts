import { handler } from '../../../../../src/product/useCases/delete/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Delete Product Lambda', () => {
  let mockProductDelete: jest.Mock;

  beforeEach(() => {
    mockProductDelete = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      product: {
        delete: mockProductDelete,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should return 200 if a valid product is deleted', async () => {
    const event = {
      pathParameters: {
        id: 123,
      },
    } as any;

    mockProductDelete.mockResolvedValue(true);

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Product deleted successfully');
    expect(body.data).toBeTruthy();
    expect(mockProductDelete).toHaveBeenCalledTimes(1);
    expect(mockProductDelete).toHaveBeenCalledWith({ where: { id: 123 } });
  });

  it('should return 400 if productId is not sent', async () => {
    const event = {
      pathParameters: {
        id: null,
      },
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Product ID is required');
    expect(mockProductDelete).not.toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      pathParameters: {
        id: 999,
      },
    } as any;

    mockProductDelete.mockRejectedValue(new Error('Not found'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
    expect(mockProductDelete).toHaveBeenCalledTimes(1);
    expect(mockProductDelete).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
