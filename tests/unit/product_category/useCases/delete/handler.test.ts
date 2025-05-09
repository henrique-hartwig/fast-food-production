import { handler } from '../../../../../src/product_category/useCases/delete/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Delete Product Category Lambda', () => {
  let mockProductCategoryDelete: jest.Mock;

  beforeEach(() => {
    mockProductCategoryDelete = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      productCategory: {
        delete: mockProductCategoryDelete,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should return 200 if a valid product category is deleted', async () => {
    const event = {
      pathParameters: {
        id: 123,
      },
    } as any;

    mockProductCategoryDelete.mockResolvedValue(true);

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Product category deleted successfully');
    expect(body.data).toBeTruthy();
    expect(mockProductCategoryDelete).toHaveBeenCalledTimes(1);
    expect(mockProductCategoryDelete).toHaveBeenCalledWith({ where: { id: 123 } });
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
    expect(mockProductCategoryDelete).not.toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      pathParameters: {
        id: 999,
      },
    } as any;

    mockProductCategoryDelete.mockRejectedValue(new Error('Not found'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
    expect(mockProductCategoryDelete).toHaveBeenCalledTimes(1);
    expect(mockProductCategoryDelete).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});