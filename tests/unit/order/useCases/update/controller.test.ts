import { UpdateOrderController } from '../../../../../src/order/useCases/update/controller';
import { OrderService } from '../../../../../src/order/domain/service';

describe.only('UpdateProductController', () => {
  let controller: UpdateOrderController;
  let service: jest.Mocked<OrderService>;

  beforeEach(() => {
    service = {
      updateOrder: jest.fn(),
    } as any;
    controller = new UpdateOrderController(service);
  });

  it('should update the order', async () => {
    const request = {
      id: 1,
      items: { items: [{ id: 1, quantity: 1 }] },
      total: 10,
      userId: 1
    };
    service.updateOrder.mockResolvedValue({
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
    expect(service.updateOrder).toHaveBeenCalledWith(1,
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
      id: 1,
      items: { items: [{ id: 1, quantity: 1 }] },
      total: 10,
      userId: 1
    };
    service.updateOrder.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = {
      id: 1,
      items: { items: [{ id: 1, quantity: 1 }] },
      total: 10,
      userId: 1
    };
    service.updateOrder.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
