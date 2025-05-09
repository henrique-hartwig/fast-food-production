import { ListOrdersController } from '../../../../../src/order/useCases/list/controller';
import { OrderService } from '../../../../../src/order/domain/service';

describe('ListOrdersController', () => {
  let controller: ListOrdersController;
  let service: jest.Mocked<OrderService>;

  beforeEach(() => {
    service = {
      listOrders: jest.fn(),
    } as any;
    controller = new ListOrdersController(service);
  });

  it('should list the orders', async () => {
    const request = { limit: 10, offset: 0 };
    service.listOrders.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.listOrders).toHaveBeenCalledWith(10, 0);
  });

  it('should throw validation error', async () => {
    const request = { limit: 10, offset: 0 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { limit: 10, offset: 0 };
    service.listOrders.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { limit: 10, offset: 0 };
    service.listOrders.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
