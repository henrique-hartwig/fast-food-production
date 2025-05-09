import { handler } from '../../../../../src/product/useCases/update/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Update Product Lambda', () => {
  let mockProductUpdate: jest.Mock;
  let mockProductFindUnique: jest.Mock;

  beforeEach(() => {
    mockProductUpdate = jest.fn();
    mockProductFindUnique = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      product: {
        update: mockProductUpdate,
        findUnique: mockProductFindUnique,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should update the product', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        name: 'Product 2',
        description: 'Description 2',
        price: 200.0,
        categoryId: 1,
      }),
    } as any;


    mockProductFindUnique.mockResolvedValue({
      id: 123,
      name: 'Product 1',
      description: 'Description 1',
      price: 100.0,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockProductUpdate.mockResolvedValue({
      id: 123,
      name: 'Product 2',
      description: 'Description 2',
      price: 200.0,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data).toEqual({
      id: 123,
      name: 'Product 2',
      description: 'Description 2',
      price: 200.0,
      categoryId: 1
    });
  });

  it('should return 400 if body is not provided', async () => {
    const event = {
      pathParameters: { id: 123 }
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Product ID and body are required');
    expect(mockProductUpdate).not.toHaveBeenCalled();
  });

  it('should return 400 if order id is not provided in path', async () => {
    const event = {
      body: JSON.stringify({
        name: 'Product 2',
        description: 'Description 2',
        price: 200.0,
        categoryId: 1,
      })
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Product ID and body are required');
    expect(mockProductUpdate).not.toHaveBeenCalled();
  });

  it('should return 500 for generic errors', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        name: 'Product 2',
        description: 'Description 2',
        price: 200.0,
        categoryId: 1,
      }),
    } as any;

    mockProductUpdate.mockRejectedValueOnce(new Error('Generic error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
  });
});
