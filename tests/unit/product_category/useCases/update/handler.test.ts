import { handler } from '../../../../../src/product_category/useCases/update/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Update Product Category Lambda', () => {
  let mockProductCategoryUpdate: jest.Mock;
  let mockProductCategoryFindUnique: jest.Mock;

  beforeEach(() => {
    mockProductCategoryUpdate = jest.fn();
    mockProductCategoryFindUnique = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      productCategory: {
        update: mockProductCategoryUpdate,
        findUnique: mockProductCategoryFindUnique,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should update the product category', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        name: 'Product Category 2',
        description: 'Description 2',
      }),
    } as any;

    mockProductCategoryFindUnique.mockResolvedValue({
      id: 123,
      name: 'Product Category 1',
      description: 'Description 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockProductCategoryUpdate.mockResolvedValue({
      id: 123,
      name: 'Product Category 2',
      description: 'Description 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data).toMatchObject({
      id: 123,
      name: 'Product Category 2',
      description: 'Description 2',
    });
  });

  it('should return 400 if body is not provided', async () => {
    const event = {
      pathParameters: { id: 123 }
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Product category ID and body are required');
    expect(mockProductCategoryUpdate).not.toHaveBeenCalled();
  });

  it('should return 400 if product category id is not provided in path', async () => {
    const event = {
      body: JSON.stringify({
        name: 'Product Category 2',
        description: 'Description 2',
      })
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Product category ID and body are required');
    expect(mockProductCategoryUpdate).not.toHaveBeenCalled();
  });

  it('should return 500 for generic errors', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        name: 'Product Category 2',
        description: 'Description 2',
      }),
    } as any;

    mockProductCategoryUpdate.mockRejectedValueOnce(new Error('Generic error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
  });
});
