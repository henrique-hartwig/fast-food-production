import { handler } from '../../../../../src/product_category/useCases/get/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Get Product Category Lambda', () => {
  let mockProductCategoryGet: jest.Mock;

  beforeEach(() => {
    mockProductCategoryGet = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      productCategory: {
        findUnique: mockProductCategoryGet,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should return 200 if find the product category', async () => {
    const event = {
      pathParameters: {
        id: 123,
      },
    } as any;

    mockProductCategoryGet.mockResolvedValue({
      id: 123,
      name: 'Category 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data).toMatchObject({
      id: 123,
      name: 'Category 1',
    });
  });

  it('should return 400 if productCategoryId is not sent', async () => {
    const event = {
      pathParameters: {
        id: null,
      },
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Product category ID is required');
    expect(mockProductCategoryGet).not.toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      pathParameters: {
        id: 999,
      },
    } as any;

    mockProductCategoryGet.mockRejectedValue(new Error('Not found'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
    expect(mockProductCategoryGet).toHaveBeenCalledTimes(1);
    expect(mockProductCategoryGet).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
