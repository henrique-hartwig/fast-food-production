import { handler } from '../../../../../src/product/useCases/get/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Get Product Lambda', () => {
  let mockProductGet: jest.Mock;

  beforeEach(() => {
    mockProductGet = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      product: {
        findUnique: mockProductGet,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should return 200 if find the product', async () => {
    const event = {
      pathParameters: {
        id: 123,
      },
    } as any;

    mockProductGet.mockResolvedValue({
      id: 123,
      name: 'Product 1',
      description: 'Description 1',
      price: 10.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data).toMatchObject({
      id: 123,
      name: 'Product 1',
      description: 'Description 1',
      price: 10.0,
    });
    expect(mockProductGet).toHaveBeenCalledTimes(1);
    expect(mockProductGet).toHaveBeenCalledWith({ where: { id: 123 } });
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
    expect(mockProductGet).not.toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      pathParameters: {
        id: 999,
      },
    } as any;

    mockProductGet.mockRejectedValue(new Error('Not found'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
    expect(mockProductGet).toHaveBeenCalledTimes(1);
    expect(mockProductGet).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
