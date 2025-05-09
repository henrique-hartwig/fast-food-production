import { handler } from '../../../../../src/order/useCases/create/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
  };
});

describe('Create Order Lambda', () => {
  let mockOrderCreate: jest.Mock;

  beforeEach(() => {
    mockOrderCreate = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      order: {
        create: mockOrderCreate,
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
    expect(mockOrderCreate).not.toHaveBeenCalled();
  });

  it('should return 201 if a valid order is created', async () => {
    const event = {
      body: JSON.stringify({
        items: { items: [{ id: 1, quantity: 2 }]},
        total: 50.0,
        userId: 1,
      }),
    } as any;

    const fakeOrder = {
      id: 123,
      items: [{ id: 1, quantity: 2 }],
      total: 50.0,
      status: 'received',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockOrderCreate.mockResolvedValue(fakeOrder);

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Order created successfully');
    expect(body.data).toMatchObject({
      id: 123,
      total: 50.0,
      status: 'received',
      userId: 1,
    });
    expect(mockOrderCreate).toHaveBeenCalledTimes(1);
  });

  it('should return 400 if validation error occurs', async () => {
    const event = {
      body: JSON.stringify({
        items: { items: []},
        total: 'not-a-number',
        userId: 1,
      }),
    } as any;

    const zodError = new Error('Validation error');
    zodError.name = 'ZodError';
    (zodError as any).errors = [{ path: ['total'], message: 'Invalid number' }];

    mockOrderCreate.mockImplementation(() => { throw zodError; });

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Validation error');
    expect(body.details).toBeDefined();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const event = {
      body: JSON.stringify({
        items: { items: [{ id: 1, quantity: 2 }]},
        total: 50.0,
        userId: 1,
      }),
    } as any;

    mockOrderCreate.mockRejectedValue(new Error('DB error'));

    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal server error');
    expect(mockOrderCreate).toHaveBeenCalledTimes(1);
  });
});
