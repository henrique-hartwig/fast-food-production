import { GetOrderController } from '../../../../../src/order/useCases/get/controller';
import { OrderService } from '../../../../../src/order/domain/service';

describe('GetOrderController', () => {
  let controller: GetOrderController;
  let service: jest.Mocked<OrderService>;

  beforeEach(() => {
    service = {
      getOrderById: jest.fn(),
    } as any;
    controller = new GetOrderController(service);
  });

  it('should get the order', async () => {
    const request = { id: 1 };
    service.getOrderById.mockResolvedValue({ id: 1 } as any);

    const result = await controller.handle(request as any);

    expect(result).toEqual({ id: 1 } as any);
    expect(service.getOrderById).toHaveBeenCalledWith(1);
  });

  it('should throw validation error', async () => {
    const request = { id: 1 };

    await expect(controller.handle(request as any)).rejects.toThrow();
  });

  it('should throw error if the service returns an error', async () => {
    const request = { id: 1 };
    service.getOrderById.mockResolvedValue({ error: 'Service error' } as any);

    await expect(controller.handle(request as any)).rejects.toThrow('Service error');
  });

  it('should throw unexpected error', async () => {
    const request = { id: 1 };
    service.getOrderById.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.handle(request as any)).rejects.toThrow('Unexpected error');
  });
});
