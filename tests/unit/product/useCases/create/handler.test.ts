import { handler } from '../../../../../src/product/useCases/create/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Create Product Lambda', () => {
  let mockProductCreate: jest.Mock;

  beforeEach(() => {
    mockProductCreate = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      product: {
        create: mockProductCreate,
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
    expect(mockProductCreate).not.toHaveBeenCalled();
  });

  it('should return 201 if a valid product is created', async () => {
    const event = {
      body: JSON.stringify({
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        categoryId: 1,
      }),
    } as any;

    const fakeProduct = {
      id: 123,
      name: 'Test Product',
      description: 'This is a test product',
      price: 100,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProductCreate.mockResolvedValue(fakeProduct);

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Product created successfully');
    expect(body.data).toMatchObject({
      id: 123,
      name: 'Test Product',
      description: 'This is a test product',
      price: 100,
      categoryId: 1,
    });
    expect(mockProductCreate).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if validation error occurs', async () => {
    const event = {
      body: JSON.stringify({
        name: '',
        description: 'This is a test product',
        price: 100,
        categoryId: 1,
      }),
    } as any;

    const zodError = new Error('Validation error');
    zodError.name = 'ZodError';
    (zodError as any).errors = [{ path: ['name'], message: 'Invalid name' }];

    mockProductCreate.mockImplementation(() => { throw zodError; });

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Validation error');
    expect(body.details).toBeDefined();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      body: JSON.stringify({
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        categoryId: 1,
      }),
    } as any;

    mockProductCreate.mockRejectedValue(new Error('DB error'));

    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal server error');
    expect(mockProductCreate).toHaveBeenCalledTimes(1);
  });
});
