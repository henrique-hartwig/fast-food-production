import { handler } from '../../../../../src/product_category/useCases/create/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Create Product Category Lambda', () => {
  let mockProductCategoryCreate: jest.Mock;

  beforeEach(() => {
    mockProductCategoryCreate = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      productCategory: {
        create: mockProductCategoryCreate,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should return 400 if no body is sent', async () => {
    const event = { body: null } as any;
    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Request body is required');
    expect(mockProductCategoryCreate).not.toHaveBeenCalled();
  });

  it('should return 201 if a valid product category is created', async () => {
    const event = {
      body: JSON.stringify({
        name: 'Test Product Category',
        description: 'This is a test product category',
      }),
    } as any;

    const fakeProductCategory = {
      id: 123,
      name: 'Test Product Category',
      description: 'This is a test product category',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProductCategoryCreate.mockResolvedValue(fakeProductCategory);

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Product Category created successfully');
    expect(body.data).toMatchObject({
      id: 123,
      name: 'Test Product Category',
      description: 'This is a test product category',
    });
    expect(mockProductCategoryCreate).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if validation error occurs', async () => {
    const event = {
      body: JSON.stringify({
        name: '',
        description: 'This is a test product category',
      }),
    } as any;

    const zodError = new Error('Validation error');
    zodError.name = 'ZodError';
    (zodError as any).errors = [{ path: ['name'], message: 'Invalid name' }];

    mockProductCategoryCreate.mockImplementation(() => { throw zodError; });

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Validation error');
    expect(body.details).toBeDefined();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      body: JSON.stringify({
        name: 'Test Product Category',
        description: 'This is a test product category',
      }),
    } as any;

    mockProductCategoryCreate.mockRejectedValue(new Error('DB error'));

    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal server error');
    expect(mockProductCategoryCreate).toHaveBeenCalledTimes(1);
  });
});
