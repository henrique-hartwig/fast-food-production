import { CreateOrderController } from '../../../../../src/order/useCases/create/controller';
import { OrderService } from '../../../../../src/order/domain/service';

describe('CreateOrderController', () => {
  let controller: CreateOrderController;
  let service: jest.Mocked<OrderService>;

  beforeEach(() => {
    service = {
      createOrder: jest.fn(),
    } as any;
    controller = new CreateOrderController(service);
  });

  it('should create the order', async () => {
    const request = {
      id: 1,
      items: { items: [{ id: 1, quantity: 1 }] },
      total: 10,
      userId: 1
    };
    service.createOrder.mockResolvedValue({
      id: 1,
      items: { items: [{ id: 1, quantity: 1 }] },
      total: 10,
      userId: 1
    } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({
      id: 1,
      items: { items: [{ id: 1, quantity: 1 }] },
      total: 10,
      userId: 1
    } as any);
    expect(service.createOrder).toHaveBeenCalledWith(
      { items: { items: [{ id: 1, quantity: 1 }] } },
      10,
      1
    );
  });

  it('should throw validation error', async () => {
    const request = {
      id: 1,
      items: { items: [{ id: 1, quantity: 1 }] },
      total: 10,
      userId: 1
    };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = {
      items: { items: [{ id: 1, quantity: 1 }] },
      total: 10,
      userId: 1
    };
    service.createOrder.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = {
      items: { items: [{ id: 1, quantity: 1 }] },
      total: 10,
      userId: 1
    };
    service.createOrder.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
