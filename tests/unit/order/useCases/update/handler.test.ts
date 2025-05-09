import { handler } from '../../../../../src/order/useCases/update/handler';
import { PrismaClient } from '@prisma/client';


jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(),
    OrderStatus: {
      RECEIVED: 'received',
      IN_PREPARATION: 'in_preparation',
      READY: 'ready',
      FINISHED: 'finished',
    },
  };
});

describe('Update Order Lambda', () => {
  let mockOrderUpdate: jest.Mock;
  let mockOrderFindUnique: jest.Mock;

  beforeEach(() => {
    mockOrderUpdate = jest.fn();
    mockOrderFindUnique = jest.fn();

    (PrismaClient as jest.Mock).mockImplementation(() => ({
      order: {
        update: mockOrderUpdate,
        findUnique: mockOrderFindUnique,
      },
      $disconnect: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it('should update the items of the order', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        items: { items: [{ id: 2, quantity: 5 }]},
        total: 100.0,
      }),
    } as any;


    mockOrderFindUnique.mockResolvedValue({
      id: 123,
      status: 'received',
      userId: 1,
      items: { items: [{ id: 2, quantity: 2 }]},
      total: 100.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockOrderUpdate.mockResolvedValue({
      id: 123,
      status: 'received',
      userId: 1,
      items: { items: [{ id: 2, quantity: 5 }]},
      total: 100.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data.items).toEqual({ items: [{ id: 2, quantity: 5 }]});
  });

  it('should update multiple fields of the order', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        userId: 77,
        total: 300.0,
        items: { items: [{ id: 3, quantity: 1 }]}
      }),
    } as any;

    mockOrderFindUnique.mockResolvedValue({
      id: 123,
      status: 'received',
      userId: 7,
      items: { items: [{ id: 3, quantity: 2 }]},
      total: 300.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockOrderUpdate.mockResolvedValue({
      id: 123,
      status: 'received',
      userId: 77,
      items: { items: [{ id: 3, quantity: 1 }]},
      total: 300.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data).toMatchObject({
      userId: 77,
      total: 300.0,
      items: { items: [{ id: 3, quantity: 1 }]},
      status: 'received'
    });
  });

  it('should return 400 if items is empty', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        items: []
      }),
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Validation error');
    expect(mockOrderUpdate).not.toHaveBeenCalled();
  });

  it('should return 400 if total is negative', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        total: -10
      }),
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Validation error');
    expect(mockOrderUpdate).not.toHaveBeenCalled();
  });

  it('should return 400 if body is not provided', async () => {
    const event = {
      pathParameters: { id: 123 }
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Order ID and items are required');
    expect(mockOrderUpdate).not.toHaveBeenCalled();
  });

  it('should return 400 if order id is not provided in path', async () => {
    const event = {
      body: JSON.stringify({
        items: [{ id: 3, quantity: 1 }],
        total: 300.0,
        userId: 77
      })
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Order ID and items are required');
    expect(mockOrderUpdate).not.toHaveBeenCalled();
  });

  
  it('should return 500 for generic errors', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        items: { items: [{ id: 3, quantity: 1 }]},
        total: 300.0,
        userId: 77
      }),
    } as any;

    mockOrderUpdate.mockRejectedValueOnce(new Error('Generic error'));

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
  });
});
