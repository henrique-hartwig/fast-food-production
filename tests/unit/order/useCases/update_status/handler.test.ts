import { handler } from '../../../../../src/order/useCases/update_status/handler';
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

describe('Update Order Status Lambda', () => {
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

  it('should update the order status correctly', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        status: 'ready'
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
      status: 'ready',
      userId: 1,
      items: { items: [{ id: 2, quantity: 2 }]},
      total: 100.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data.status).toBe('ready');
    expect(body.data.id).toBe(123);
  });

  it('should return 400 if the order id is not provided', async () => {
    const event = {
      body: JSON.stringify({
        status: 'ready'
      }),
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Order Id and status are required');
    expect(mockOrderUpdate).not.toHaveBeenCalled();
  });

  it('should return 400 if the status is not provided', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({}),
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Order Id and status are required');
    expect(mockOrderUpdate).not.toHaveBeenCalled();
  });

  it('should return 400 if the status is invalid', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        status: 'invalid_status'
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
  
    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
    expect(mockOrderUpdate).not.toHaveBeenCalled();
  });

  it('should return 500 for generic errors', async () => {
    const event = {
      pathParameters: { id: 123 },
      body: JSON.stringify({
        status: 'ready'
      }),
    } as any;

    mockOrderUpdate.mockRejectedValueOnce(new Error('Generic error'));

    mockOrderFindUnique.mockResolvedValue({
      id: 123,
      status: 'received',
      userId: 1,
      items: { items: [{ id: 2, quantity: 2 }]},
      total: 100.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Internal server error');
  });
});
